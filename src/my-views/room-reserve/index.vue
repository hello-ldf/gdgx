<template>
  <div class="app-container">

    <el-tabs v-model="activeName">
      <el-tab-pane label="预订查询" name="list" disabled>
        <!-- 顶部工具 -->
        <div class="filter-container">
          <el-input :placeholder="$t('姓')" v-model="listQuery.lastName"
            style="width:105px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input :placeholder="$t('名')" v-model="listQuery.firstName"
            style="width:105px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-input :placeholder="$t('房号')" v-model="listQuery.roomNo"
            style="width:105px" class="filter-item" @keyup.enter.native="handleFilter" />
          <el-date-picker :placeholder="$t('入住日期')" v-model="listQuery.checkinDate"
            :picker-options="pickerOptions" type="date" class="filter-item" @change="handleFilter" />
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search"
            @click="handleFilter">
            {{ $t('查找') }}
          </el-button>
          <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus"
            @click="handleCreate">{{
            $t('新增预订') }}</el-button>
        </div>

        <!-- 表格 -->
        <el-table v-loading="listLoading" id="table" key="0" :data="list" width="100%"
          height="380px" border fit highlight-current-row @row-dblclick="handleUpdate">
          <el-table-column :label="$t('房号')" width="120" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.roomNo }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('姓名')" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.lastName }}{{ scope.row.firstName }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('入住日期')" width="130" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.checkinDate | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('退房日期')" width="130" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.checkoutDate | parseTime('{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('时长')" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.stayDuration }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('入住人数')" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.attendance }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('单价')" width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.unitPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('总价')" width="100" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.totalPrice }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('押金')" width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.deposit }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('备注')" min-width="150px" align="center">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.remark" class="item" effect="dark" placement="right-end">
                <nobr>{{ scope.row.remark }}</nobr>
              </el-tooltip>
            </template>
          </el-table-column>

        </el-table>

        <!-- 分页栏 -->
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page"
          :limit.sync="listQuery.limit" small background @pagination="getList" />

      </el-tab-pane>

      <el-tab-pane label="预订明细" name="detail" disabled>
        <sticky class-name="sub-navbar">
          <span style="margin: 5px"/>

          <el-button icon="el-icon-back" @click="handleCloseDetail">返回</el-button>
          <el-button type="success" icon="el-icon-check" style="margin-left: 20px" @click="handleSave">保存</el-button>

          <span style="margin: 5px"/>

          <el-button :disabled.sync="toolDisabled" @click="handleCloseDetail">{{ $t('客人档案') }}</el-button>
          <el-button :disabled.sync="toolDisabled" @click="handleOpenHistory">{{ $t('历史记录') }}</el-button>
          <router-link :to="'../Bill/index/'+temp.orderNo">
            <el-button :disabled.sync="toolDisabled">{{ $t('账单') }}</el-button>
          </router-link>
          <!-- <el-button :disabled.sync="toolDisabled" @click="dialogFormVisible = false">{{ $t('账单') }}</el-button> -->

          <el-button style="margin-left: 30px;" type="success">#option#</el-button>
        </sticky>
        <!-- 编辑对话框 -->
        <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible"
          :show-close="false" top="5vh" width="1000px"> -->

        <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true"
          label-position="left" label-width="140px" style="padding-top: 60px">
          <el-row>
            <el-col :sm="10" :lg="8" >
              <el-form-item :label="$t('姓')" prop="lastName">
                <el-input v-model="temp.lastName" />
              </el-form-item>
              <el-form-item :label="$t('名')" prop="firstName">
                <el-input v-model="temp.firstName" />
              </el-form-item>
              <el-form-item :label="$t('电话')" prop="contactNumber">
                <el-input v-model="temp.contactNumber" />
              </el-form-item>
            </el-col>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('性别')" prop="sex">
                <!-- <el-input v-model="temp.sex" /> -->
                <el-radio-group v-model="temp.sex">
                  <el-radio :label="0">{{ $t('female') }}</el-radio>
                  <el-radio :label="1" >{{ $t('male') }}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('用户号')" prop="userNo">
                <el-input v-model="temp.userNo" />
              </el-form-item>
              <el-form-item :label="$t('邮箱')" prop="email">
                <el-input v-model="temp.email" />
              </el-form-item>
            </el-col>
            <!-- <el-col :sm="2">
              <el-button v-waves circle style="font-size: 50px">
                <svg-icon icon-class="print" />
              </el-button>
            </el-col> -->
          </el-row>
          <hr>
          <el-row>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('入住日期')" prop="checkinDate">
                <!-- <el-input v-model="temp.checkinDate" /> -->
                <el-date-picker v-model="temp.checkinDate" :picker-options="pickerOptions" type="datetime"/>
              </el-form-item>
              <el-form-item :label="$t('退房日期')" prop="checkoutDate">
                <!-- <el-input v-model="temp.checkoutDate" /> -->
                <el-date-picker v-model="temp.checkoutDate" :picker-options="pickerOptions" type="datetime"/>
              </el-form-item>
              <el-form-item :label="$t('入住时长')" prop="stayDuration">
                <el-input v-model="temp.stayDuration" />
              </el-form-item>
              <el-form-item :label="$t('入住人数')" prop="attendance">
                <el-input v-model="temp.attendance" />
              </el-form-item>
            </el-col>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('房号')" prop="roomNo">
                <el-input v-model="temp.roomNo" />
              </el-form-item>
              <el-form-item :label="$t('单价')" prop="unitPrice">
                <el-input v-model="temp.unitPrice" />
              </el-form-item>
              <el-form-item :label="$t('总价')" prop="totalPrice">
                <el-input v-model="temp.totalPrice" />
              </el-form-item>
              <el-form-item :label="$t('押金')" prop="deposit">
                <el-input v-model="temp.deposit" />
              </el-form-item>
            </el-col>
          </el-row>
          <hr>
          <el-row>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('付款金额')" prop="payway">
                <el-input v-model="temp.payway" />
              </el-form-item>
              <el-form-item :label="$t('付款人')" prop="payman">
                <el-input v-model="temp.payman" />
              </el-form-item>
              <el-form-item :label="$t('付款账户')" prop="bankAccount">
                <el-input v-model="temp.bankAccount" />
              </el-form-item>
            </el-col>
            <el-col :sm="10" :lg="8">
              <el-form-item :label="$t('公司名')" prop="companyName">
                <el-input v-model="temp.companyName" />
              </el-form-item>
              <el-form-item :label="$t('公司类型')" prop="companyType">
                <el-input v-model="temp.companyType" />
              </el-form-item>
              <el-form-item :label="$t('公司代码')" prop="organizationCode">
                <el-input v-model="temp.organizationCode" />
              </el-form-item>
              <el-form-item :label="$t('营业代码')" prop="registeredCode">
                <el-input v-model="temp.registeredCode" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :sm="18">
              <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="temp.remark" :placeholder="$t('备注')"
                type="textarea" />
            </el-col>
            <el-col :sm="4"/>
          </el-row>
        </el-form>

      </el-tab-pane>

      <el-tab-pane label="历史记录" name="history" disabled>
        <sticky class-name="sub-navbar">
          <el-button style="margin-left: 20px" @click="handleRefreshHistory">{{ $t('刷新') }}</el-button>
          <el-button @click="handleCloseHistory">{{ $t('关闭') }}</el-button>
        </sticky>
        <!-- 表格 -->
        <el-table v-loading="listLoading" id="table" key="0" :data="histories" style="margin-top: 60px"
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
import {
  fetchRoomReserve,
  createRoomReserve,
  updateRoomReserve
} from '@/api/room-reserve'
import { fetchHistory } from '@/api/history'
import waves from '@/directive/waves' // Waves directive
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky'

// 动态高度 navbar50、tags34、    pad20+20、工具56、分页栏36
const otherHeight = 50 + 34 + 40 + 56 + 36
// const otherHeight = 40 + 56 + 36

export default {
  name: 'RoomReserve',
  components: { Pagination, Sticky },
  directives: { waves },
  filters: {
    stateFilter(state) {
      const stateMap = {
        complete: 'success',
        book: 'info',
        cancel: 'danger'
      }
      return stateMap[state]
    }
  },
  data() {
    return {
      // 状态选项
      stateOptions: [
        {
          value: 'complete',
          label: '完成'
        }, {
          value: 'book',
          label: '预订'
        }, {
          value: 'cancel',
          label: '取消'
        }
      ],
      // 日期选择器配置
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
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        firstName: undefined,
        lastName: undefined,
        checkinDate: undefined,
        roomNo: undefined
        // state: [],
        // stateJson: JSON.stringify([]),
      },
      temp: {
        userNo: 'User No.',
        firstName: 'First Name',
        lastName: 'Last Name',
        contactNumber: 'Contact Number',
        sex: 'Sex',
        email: 'e-Mail',
        checkinDate: 'Check-In Date',
        stayDuration: 'Stay Duration',
        checkoutDate: 'Check-Out Date',
        checkinPeople: 'Check-In People',
        roomNo: 'Room No.',
        unitPrice: 'Unit Price',
        totalPrice: 'Total Price',
        deposit: 'Deposit',
        payway: 'Payway',
        payman: 'Pay Man',
        companyName: 'Company Name',
        companyType: 'Company Type',
        organizationCode: 'Organization Code',
        registeredCode: 'Registered Code',
        remark: 'Remark',
      },
      activeName: 'list',
      dialogFormVisible: false,
      dialogStatus: '',
      toolDisabled: false,
      textMap: {
        update: '修改预订',
        create: '新增预订'
      },
      // form表单的验证
      rules: {
        type: [
          { required: true, message: 'type is required', trigger: 'change' }
        ],
        timestamp: [
          {
            type: 'date',
            required: true,
            message: 'timestamp is required',
            trigger: 'change'
          }
        ],
        title: [
          { required: true, message: 'title is required', trigger: 'blur' }
        ]
      },
      /* tab3 */
      tab3Title: '',
      histories: []
    }
  },
  computed: {
  },
  watch: {
    dialogStatus: function(newValue, oldValue) {
      this.toolDisabled = (newValue === 'create')
      // console.log(this.toolDisabled)
    }
  },
  created() {
    this.getList()
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
  methods: {
    // 获取预订列表 【实现
    getList() {
      this.listLoading = true
      fetchRoomReserve(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 查询预订列表
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 重置预订明细
    resetTemp() {
      this.temp = {
        id: undefined
      }
    },
    // 关闭预订明细
    handleCloseDetail() {
      this.$confirm('未保存的信息将会丢失', '确认关闭？', { type: 'warning' })
        .then(_ => {
          this.activeName = 'list'
          // this.dialogFormVisible = false
          this.dialogStatus = ''
          // this.getList()
        })
        .catch(_ => {})
    },
    // 保存预订明细
    handleSave() {
      if (this.dialogStatus === 'create') {
        this.createData()
      } else {
        this.updateData()
      }
    },
    // 打开预订明细 - 新增
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.activeName = 'detail'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 新建预订
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          createRoomReserve(this.temp).then(() => {
            this.getList()
            this.activeName = 'list'
            this.dialogStatus = ''
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    // 打开预订明细 - 修改
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.activeName = 'detail'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 更新预订
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateRoomReserve(tempData).then(() => {
            this.getList()
            // this.activeName = 'list'
            // this.dialogStatus = ''
            // this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 1000
            })
          })
        }
      })
    },
    // 查看历史操作
    handleOpenHistory() {
      this.tab3Title = this.$t('历史记录')
      this.activeName = 'history'
      this.handleRefreshHistory()
    },
    // 刷新历史记录
    handleRefreshHistory() {
      this.listLoading = true
      const data = {
        type: 'RoomReserve',
        orderNo: this.temp.orderNo
      }
      fetchHistory(data).then((response) => {
        this.histories = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 关闭历史记录
    handleCloseHistory() {
      this.tab3Title = this.$t('')
      this.activeName = 'detail'
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 0 !important;
  padding-top: 10px !important;
  padding-bottom: 0 !important;
}
</style>
