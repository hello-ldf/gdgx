<template>
  <div class="app-container">

    <div class="filter-container">
      <el-input :placeholder="$t('meetingRoom.params.lastName')" v-model="listQuery.firstName" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('meetingRoom.params.firstName')" v-model="listQuery.lastName" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('meetingRoom.params.roomNo')" v-model="listQuery.roomNo" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker :placeholder="$t('meetingRoom.params.checkInDT')" v-model="listQuery.checkInDT"
        :picker-options="pickerOptions1" type="date" class="filter-item" @change="handleFilter"/>
      <el-select v-model="listQuery.state" clearable placeholder="状态" style="width: 200px;" class="filter-item" @change="quertStateChange">
        <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- <el-select v-model="listQuery.type" :placeholder="$t('room.params.state')" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key"/>
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('meetingRoom.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">{{ $t('meetingRoom.book') }}</el-button>
      <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button> -->
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">{{ $t('table.reviewer') }}</el-checkbox> -->
    </div>

    <el-table v-loading="listLoading" id="test" :key="tableKey" :data="list"
      width="100%" height="380"
      border fit highlight-current-row
      @sort-change="sortChange" @row-dblclick="handleUpdate">
      <el-table-column :label="$t('meetingRoom.table.date')" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkInDT | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.time')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.checkInDT | parseTime('{h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.meetingRoomNo')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.meetingRoomNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.peopleNum')" width="50px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.peopleNum }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('预订人')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.firstName }}_{{ scope.row.lastName }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.roomNo')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roomNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.free')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.free }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.payway')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payway }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.device')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.device }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.staff')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.staff }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('meetingRoom.table.remark')" min-width="150px">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :label="$t('meetingRoom.table.state')" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.state }}</span>
        </template>
      </el-table-column> -->
      <el-table-column :label="$t('meetingRoom.table.state')" class-name="status-col" width="80px">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | stateFilter">{{ scope.row.state }}</el-tag>
        </template>
      </el-table-column>

      <!-- <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width" fixed="left">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-if="scope.row.status!='published'" size="mini" type="success" @click="handleModifyStatus(scope.row,'published')">{{ $t('table.publish') }}
          </el-button>
          <el-button v-if="scope.row.status!='draft'" size="mini" @click="handleModifyStatus(scope.row,'draft')">{{ $t('table.draft') }}
          </el-button>
          <el-button v-if="scope.row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" small background @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="5vh" width="800px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="left" label-width="100px">
        <el-row>
          <el-col :md="24">
            <el-form-item label="日期" prop="checkInDT">
              <el-date-picker v-model="temp.checkInDT" :picker-options="pickerOptions1" align="right" type="datetime" placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :md="12">
            <el-form-item label="日期" prop="timestamp">
              <el-date-picker v-model="temp.date" :picker-options="pickerOptions1" align="right" type="date" placeholder="选择日期"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item label="时间" prop="timestamp">
              <el-time-select v-model="temp.time" :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }" placeholder="选择时间"/>
            </el-form-item>
          </el-col> -->
          <el-col :md="12">
            <el-form-item :label="$t('会议室号')" prop="meetingRoomNo">
              <el-input v-model="temp.meetingRoomNo"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('人数')" prop="peopleNum">
              <el-input v-model="temp.peopleNum"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('预订人')" prop="firstName">
              <el-input v-model="temp.firstName"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('房间号码')" prop="roomNo">
              <el-input v-model="temp.roomNo"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('费用')" prop="free">
              <el-input v-model="temp.free"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('付款方式')" prop="payway">
              <el-input v-model="temp.payway"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('设备')" prop="device">
              <el-input v-model="temp.device"/>
            </el-form-item>
          </el-col>
          <el-col :md="12">
            <el-form-item :label="$t('员工')" prop="staff">
              <el-input v-model="temp.staff"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-input :autosize="{ minRows: 5, maxRows: 10}" v-model="temp.remark" type="textarea" placeholder="备注"/>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel"/>
        <el-table-column prop="pv" label="Pv"/>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { fetchList, fetchPv, createMeetingRoomRecord, updateArticle } from '@/api/meetingRoom'
import waves from '@/directive/waves' // Waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'yu' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

// 动态高度 navbar50、tags34、    pad20+20、工具56、分页栏36
// const otherHeight = 50 + 34 + 40 + 56 + 36
// const otherHeight = 40 + 56 + 36

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    stateFilter(state) {
      const stateMap = {
        complete: 'success',
        book: 'info',
        cancel: 'danger'
      }
      return stateMap[state]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      // 状态筛选
      stateOptions: [{
        value: 'complete',
        label: '完成'
      }, {
        value: 'book',
        label: '预订'
      }, {
        value: 'cancel',
        label: '取消'
      }],
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id',
        firstName: undefined,
        lastName: undefined,
        checkInDT: undefined,
        roomNo: undefined,
        state: [],
        stateJson: JSON.stringify([]),
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published',
        checkInDT: new Date(),
        date: '',
        time: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '会议室预订 - 修改',
        create: '会议室预订 - 新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  computed: {
    checkInDT: function() {
      console.log(this.temp.date + ' ' + this.temp.time)
      // this.temp.checkInDT = new Date(this.temp.date + ' ' + this.temp.time)
      return this.temp.date + ' ' + this.temp.time
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    // var resize = function() {
    //   var tb = document.getElementById('test')
    //   if (!tb) return
    //   var tbHeight = document.body.clientHeight - otherHeight
    //   // var tbHeight = tb.parentElement.parentElement.clientHeight - otherHeight
    //   tb.style.height = `${tbHeight}px`
    // }
    // window.onresize = resize
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    quertStateChange() {
      this.listQuery.stateJson = JSON.stringify(this.listQuery.state)
      this.handleFilter()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: '',
        checkInDT: new Date(),
        state: 'book'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createMeetingRoomRecord(this.temp).then(() => {
            // this.list.unshift(this.temp)
            this.getList()
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
  /* .app-container{
    padding-bottom: 0 !important;
  } */

  .pagination-container{
    margin-top: 0 !important;
    padding-top: 10px !important;
    padding-bottom: 0 !important;
  }
</style>
