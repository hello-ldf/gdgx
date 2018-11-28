<template>
  <div class="app-container">
    <el-tabs v-model="activeName">

      <!-- 客人列表 tabList -->
      <el-tab-pane label="客人查找" name="list" disabled>
        <!-- 顶部工具 -->
        <div class="filter-container">
          <el-input :placeholder="$t('姓')" v-model="tabList.queryParams.lastName"
            style="width:105px" class="filter-item" @keyup.enter.native="tabList.handleFilter" />
          <el-input :placeholder="$t('名')" v-model="tabList.queryParams.firstName"
            style="width:105px" class="filter-item" @keyup.enter.native="tabList.handleFilter" />
          <el-input :placeholder="$t('房号')" v-model="tabList.queryParams.roomNo"
            style="width:105px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-date-picker :placeholder="$t('入住日期')" v-model="tabList.queryParams.checkinDate"
            :picker-options="pickerOptions" type="date" class="filter-item" @change="tabList.handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
            @click="tabList.handleFilter">
            {{ $t('查找') }}
          </el-button>
          <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
            @click="handleCreate">{{
            $t('') }}</el-button> -->
        </div>
        <!-- 表格 -->
        <el-table v-loading="tabList.loading" id="table" key="0" :data="tabList.customers" width="100%"
          height="380px" border fit highlight-current-row @row-dblclick="tabList.toCustomerDetail">
          <el-table-column :label="$t('姓名')" width="160" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastName }}{{ scope.row.firstName }}</span>
              <svg-icon v-if="scope.row.sex==1" icon-class="wan_sex_m" />
              <svg-icon v-if="scope.row.sex==0" icon-class="wan_sex_w" />
            </template>
          </el-table-column>
          <el-table-column :label="$t('在住房间')" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roomNo }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('联系电话')" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.contactNumber }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('生日')" width="130" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.dateOfBirth | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('喜好')" width="130" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.like" class="item" effect="dark" placement="right-end">
                <nobr>{{ scope.row.like }}</nobr>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column :label="$t('备注')" width="200" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.remark" class="item" effect="dark" placement="right-end">
                <nobr>{{ scope.row.remark }}</nobr>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <pagination v-show="tabList.total>0" :total="tabList.total" :page.sync="tabList.queryParams.page"
          :limit.sync="tabList.queryParams.limit" small background @pagination="tabList.getCustomers" />
      </el-tab-pane>

      <!-- 客人资料 tabDetail -->
      <el-tab-pane v-loading="tabDetail.loading" label="客人资料" name="detail" disabled>
        <sticky class-name="sub-navbar">
          <span style="margin: 5px"/>

          <el-button icon="el-icon-back" @click="tabDetail.onBack">返回</el-button>
          <el-button @click="tabDetail.toHistoryTab">{{ $t('历史记录') }}</el-button>
        </sticky>

        <el-form ref="dataForm" :model="tabDetail.customer" :inline="true"
          label-position="left" label-width="140px" style="padding-top: 60px">
          <el-row>
            <el-form-item :label="$t('身份证号')" prop="firstName">
              <el-input v-model="tabDetail.customer.idNumber" />
            </el-form-item>
            <el-form-item>
              <el-button :loading="tabDetail.reading" type="primary" @click="tabDetail.onRead">读取信息</el-button>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :sm="10" :lg="8" >
              <el-form-item :label="$t('姓')" prop="lastName">
                <el-input v-model="tabDetail.customer.lastName" />
              </el-form-item>
              <el-form-item :label="$t('名')" prop="firstName">
                <el-input v-model="tabDetail.customer.firstName" />
              </el-form-item>
              <el-form-item :label="$t('性别')" prop="sex">
                <el-radio-group v-model="tabDetail.customer.sex">
                  <el-radio :label="0">{{ $t('female') }}</el-radio>
                  <el-radio :label="1" >{{ $t('male') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('出生日期')" prop="checkinDate">
                <el-date-picker v-model="tabDetail.customer.dateOfBirth" :picker-options="pickerOptions" type="date"/>
              </el-form-item>

            </el-col>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('用户号')" prop="userNo">
                <el-input v-model="tabDetail.customer.userNo" />
              </el-form-item>
              <el-form-item :label="$t('电话')" prop="contactNumber">
                <el-input v-model="tabDetail.customer.contactNumber" />
              </el-form-item>
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input v-model="tabDetail.customer.email" />
              </el-form-item>
            </el-col>
          </el-row>
          <hr>

          <el-row>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('公司名')" prop="companyName">
                <el-input v-model="tabDetail.customer.companyName" />
              </el-form-item>
              <el-form-item :label="$t('公司类型')" prop="companyType">
                <el-input v-model="tabDetail.customer.companyType" />
              </el-form-item>
            </el-col>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('公司代码')" prop="organizationCode">
                <el-input v-model="tabDetail.customer.organizationCode" />
              </el-form-item>
              <el-form-item :label="$t('营业代码')" prop="registeredCode">
                <el-input v-model="tabDetail.customer.registeredCode" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="18">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="tabDetail.customer.remark" :placeholder="$t('备注')"
                type="textarea" />
            </el-col>
            <el-col :sm="4"/>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- 历史记录 -->
      <el-tab-pane label="操作历史" name="history" disabled>
        <sticky class-name="sub-navbar">
          <el-button style="margin-left: 20px" @click="tabHistory.onRefresh">{{ $t('刷新') }}</el-button>
          <el-button @click="tabHistory.onBack">{{ $t('返回') }}</el-button>
        </sticky>
        <!-- 表格 -->
        <el-table v-loading="tabHistory.loading" id="table" key="0" :data="tabHistory.list" style="margin-top: 60px"
          width="100%" border fit highlight-current-row>
          <el-table-column :label="$t('操作日期')" width="100px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operateDate | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作时间')" width="80px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operateDate | parseTime('{h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作人')" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.employeeName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('操作人工号')" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.employeeID }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('备注')" min-width="150px" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.operate }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchCustomers, getCustomerDetail } from '@/api/customer'
import { fetchHistory } from '@/api/history'
import axios from 'axios'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky'

// 动态高度 navbar50、tags34、    pad20+20、工具56、分页栏36
const otherHeight = 50 + 34 + 40 + 56 + 36
// const otherHeight = 40 + 56 + 36

export default {
  name: 'Customer',
  components: { Pagination, Sticky },
  directives: { waves },
  data() {
    var self = {}

    Object.assign(self, {
      /* base */
      pickerOptions: {
        /* disabledDate(time) {
          return time.getTime() > Date.now()
        }, */
        shortcuts: [
          {
            text: this.$t('common.today'),
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: this.$t('common.tomorrow'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() + 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('common.yesterday'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: this.$t('common.lastWeek'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      activeName: 'list',

      /* 客人列表 tabList */
      tabList: {
        queryParams: {
          page: 1,
          limit: 20,
          firstName: undefined,
          lastName: undefined,
          checkinDate: undefined,
        },
        customers: [],
        total: 0,
        loading: true,
        getCustomers: () => { // 获取客人列表
          self.tabList.loading = true
          fetchCustomers(self.tabList.queryParams).then(response => {
            self.tabList.customers = response.data.items
            self.tabList.total = response.data.total
            setTimeout(() => {
              self.tabList.loading = false
            }, 1.5 * 1000)
          })
        },
        handleFilter: () => { // 查询预订列表
          self.tabList.queryParams.page = 1
          self.tabList.getCustomers()
        },
        toCustomerDetail: row => { // 账单详细编辑
          self.activeName = 'detail'
          self.tabDetail.currentCustomerID = row.id
          self.tabDetail.getCustomerDetail()
        },
      },

      /* 账单详细 tabDetail */
      tabDetail: {
        loading: false,
        reading: false,
        currentCustomerID: undefined,
        customer: { },

        getCustomerDetail: () => {
          self.tabDetail.loading = true
          getCustomerDetail({ customerID: self.tabDetail.currentCustomerID }).then(response => {
            const customer = response.data
            self.tabDetail.customer = Object.assign({}, customer)
            setTimeout(() => {
              self.tabDetail.loading = false
            }, 500)
          })
        },
        onBack: () => {
          self.activeName = 'list'
        }, // close
        toHistoryTab: () => {
          // this.tab3Title = this.$t('历史记录')
          self.activeName = 'history'
          self.tabHistory.onRefresh()
        },
        onRead: () => {
          self.tabDetail.reading = true
          axios.get('http://127.0.0.1:24010/ZKIDROnline/ScanReadIdCardInfo?OP-DEV=1&CMD-URL=4&REPEAT=1&READTYPE=1')
            .then(function(response) {
              self.tabDetail.reading = false
              if (response.data.ret && response.data.ret !== 0) {
                alert('读取失败')
                return false
              }

              const data = JSON.parse(response.data.replace(/\\/g, '\\\\'))
              if (data.ret !== 0) {
                alert('读取失败')
                return false
              }

              const info = data.Certificate
              if (info) {
                const customer = self.tabDetail.customer
                customer.lastName = info.Name.substring(0, 1)
                customer.firstName = info.Name.substring(1)
                customer.sex = (info.Sex === '男' ? 1 : 0)
                customer.idNumber = info.IDNumber
                customer.dateOfBirth = new Date(`${info.Birthday.substring(0, 4)}-${info.Birthday.substring(4, 6)}-${info.Birthday.substring(6, 8)}`)
              }
            })
        }
      },

      /* 历史记录 tabHistory */
      tabHistory: {
        loading: false,
        list: [],
        total: 0,
        // 刷新历史记录
        onRefresh: () => {
          self.tabHistory.loading = true
          const data = {
            type: 'customer',
            orderNo: self.tabDetail.customer.orderNo
          }
          fetchHistory(data).then((response) => {
            self.tabHistory.list = response.data.items
            self.tabHistory.total = response.data.total

            setTimeout(() => {
              self.tabHistory.loading = false
            }, 500)
          })
        },

        onBack: () => {
          // his.tab3Title = this.$t('')
          this.activeName = 'detail'
        }
      },
    })
    return self
  },
  created() {
    this.tabList.getCustomers()
  },
  mounted() {
    var resize = function() {
      var tb = document.getElementById('test')
      if (!tb) return
      var tbHeight = document.body.clientHeight - otherHeight
      // var tbHeight = tb.parentElement.parentElement.clientHeight - otherHeight
      tb.style.height = `${tbHeight}px`
    }
    resize()
    // window.onresize = resize
  },
}
</script>

<style scoped>
.pagination-container {
  margin-top: 0 !important;
  padding-top: 10px !important;
  padding-bottom: 0 !important;
}
</style>
