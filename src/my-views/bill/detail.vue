<template>
  <div class="app-container">
    <!-- 账单详细 tabDetail -->
    <div v-loading="tabDetail.loading" label="账单明细" name="detail" disabled>
      <sticky class-name="sub-navbar">
        <span style="margin: 5px"/>
        <el-button @click="tabDetail.showPostDlg">{{ $t('入账') }}</el-button>
        <el-button @click="tabDetail.showPaymentDlg">{{ $t('付款') }}</el-button>
        <el-button @click="tabDetail.toHistoryTab">{{ $t('历史记录') }}</el-button>

        <el-button style="margin-left: 30px;" type="success">#打印#</el-button>
        <el-button style="margin-left: 30px;" type="success" @click="tabDetail.onBack">返回</el-button>
      </sticky>

      <el-form ref="dataForm" :model="tabDetail.bill" :inline="true"
        label-position="left" label-width="140px" style="padding-top: 60px">
        <el-row>
          <el-col :sm="8" :lg="8" >
            <el-form-item :label="$t('房号')">
              <el-input :value="tabDetail.bill.roomNo" :readonly="true"/>
            </el-form-item>
            <el-form-item :label="$t('负责人')" prop="">
              <el-input :value="tabDetail.bill.lastName+tabDetail.bill.firstName" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :lg="8">
            <el-form-item :label="$t('入住日期')">
              <el-input :value="tabDetail.bill.checkinDate | parseTime('{y}-{m}-{d}')" :readonly="true"/>
            </el-form-item>
            <el-form-item :label="$t('退房日期')">
              <el-input :value="tabDetail.bill.checkoutDate | parseTime('{y}-{m}-{d}')" :readonly="true"/>
            </el-form-item>
          </el-col>
          <el-col :sm="8" :lg="8">
            <el-form-item :label="$t('结余金额')">
              <el-input :value="tabDetail.bill.amount" :readonly="true"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 拖拽列 -->
      <el-row>
        <el-col :sm="12">
          <BillPanel :key="1" :list="tabDetail.list1" :options="tabDetail.dragOptions" :section="1" class="kanban todo" header-text="Todo"/>
        </el-col>
        <el-col :sm="12">
          <BillPanel :key="2" :list="tabDetail.list2" :options="tabDetail.dragOptions" :section="2" class="kanban working" header-text="Working"/>
        </el-col>
      </el-row>
      <el-row>
        <el-col :sm="12">
          <BillPanel :key="3" :list="tabDetail.list3" :options="tabDetail.dragOptions" :section="3" class="kanban todo" header-text="Todo"/>
        </el-col>
        <el-col :sm="12">
          <BillPanel :key="4" :list="tabDetail.list4" :options="tabDetail.dragOptions" :section="4" class="kanban working" header-text="Working"/>
        </el-col>
      </el-row>

    </div>

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

    <!-- 入账 -->
    <el-dialog :title="$t('入账')" :visible.sync="dlgPost.visible" top="5vh" width="800px">
      <el-row>
        <el-col :sm="1">.</el-col>
        <el-col :sm="5">消费项目</el-col>
        <el-col :sm="5">项目单价</el-col>
        <el-col :sm="3">数量</el-col>
        <el-col :sm="5">总金额</el-col>
        <el-col :sm="4">备注</el-col>
      </el-row>
      <el-row v-for="item in dlgPost.list" :key="item.id">
        <el-col :sm="1">
          <el-button type="danger" icon="el-icon-delete" circle @click="dlgPost.delRow(item)"/>
        </el-col>
        <el-col :sm="5"><el-input v-model="item.item" prop="checkPass"/>
        </el-col>
        <el-col :sm="5"><el-input v-model="item.price"/>
        </el-col>
        <el-col :sm="3"><el-input v-model="item.quantity"/>
        </el-col>
        <el-col :sm="5"><el-input v-model="item.amount"/>
        </el-col>
        <el-col :sm="4"><el-input v-model="item.remark"/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgPost.addRow">添加行</el-button>
        <el-button type="primary" @click="dlgPost.onSave">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 付款 -->
    <el-dialog :title="$t('付款')" :visible.sync="dlgPayment.visible" top="5vh" width="800px">
      <el-row>
        <el-col :sm="1">.</el-col>
        <el-col :sm="5">付款方式</el-col>
        <el-col :sm="3">金额</el-col>
        <el-col :sm="6">账号</el-col>
        <el-col :sm="7">备注</el-col>
      </el-row>
      <el-row v-for="item in dlgPayment.list" :key="item.id">
        <el-col :sm="1">
          <el-button type="danger" icon="el-icon-delete" circle @click="dlgPayment.delRow(item)"/>
        </el-col>
        <el-col :sm="5"><el-input v-model="item.payment" prop="checkPass"/>
        </el-col>
        <el-col :sm="3"><el-input v-model="item.amount"/>
        </el-col>
        <el-col :sm="6"><el-input v-model="item.account"/>
        </el-col>
        <el-col :sm="7"><el-input v-model="item.remark"/>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dlgPayment.addRow">添加行</el-button>
        <el-button type="primary" @click="dlgPayment.onSave">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getBillDetail, addBillz } from '@/api/bill'
import { fetchHistory } from '@/api/history'
// import { parseTime } from '@/utils'
import waves from '@/directive/waves' // Waves directive
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import Sticky from '@/components/Sticky'
import BillPanel from '@/my-views/bill/BillPanel'

export default {
  name: 'BillDetail',
  components: { Pagination, Sticky, BillPanel },
  directives: { waves },
  data() {
    var self = {}

    var createBillz = (type) => {
      return {
        id: parseInt(Math.random() * 100) + 1024,
        orderNo: self.tabDetail.bill.orderNo,
        createDate: undefined,
        discription: '',
        // money: 0,
        amount: 0,
        remark: '',
        section: 1,
        type: type,

        item: '',
        price: '0',
        quantity: 0,

        payment: '',
        account: ''
      }
    }

    Object.assign(self, {

      /* 账单详细 tabDetail */
      refreshFlag: true,
      tabDetail: {
        loading: false,
        currentOrderNo: undefined,
        bill: {
          orderNo: undefined,
          lastName: undefined,
          firstName: undefined,
          checkinDate: undefined,
          checkoutDate: undefined,
          amount: undefined,
        },
        billzList: [],
        list1: [],
        list2: [],
        list3: [],
        list4: [],
        dragOptions: { group: 'billz' },
        getBillDetail: () => {
          self.tabDetail.loading = true
          getBillDetail({ orderNo: self.tabDetail.currentOrderNo }).then(response => {
            const bill = response.data.bill
            const billzList = response.data.billzList
            self.tabDetail.bill = Object.assign({}, bill)
            self.tabDetail.billzList = billzList
            self.refreshFlag = !self.refreshFlag
            setTimeout(() => {
              self.tabDetail.loading = false
            }, 500)
          })
        },
        onBack: () => {
          self.activeName = 'list'
        }, // close
        showPostDlg: () => { // 打开入账窗口
          self.dlgPost.visible = true
          self.dlgPost.list = []
          self.dlgPost.addRow()
        },
        showPaymentDlg: () => { // 打开付款窗口
          self.dlgPayment.visible = true
          self.dlgPayment.list = []
          self.dlgPayment.addRow()
        },
        toHistoryTab: () => {
          // this.tab3Title = this.$t('历史记录')
          self.activeName = 'history'
          self.tabHistory.onRefresh()
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
            type: 'Bill',
            associateID: self.tabDetail.bill.orderNo
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

      /* 入账窗口 dlgPost */
      dlgPost: {
        visible: false,
        list: [],
        addRow: () => { // 新增行
          const data = createBillz(1)
          self.dlgPost.list.push(data)
        },
        delRow: (row) => { // 移除行
          for (const item of self.dlgPost.list) {
            if (item.id === row.id) {
              const index = self.dlgPost.list.indexOf(item)
              self.dlgPost.list.splice(index, 1)
              break
            }
          }
        },
        onSave: () => { // 入账
          for (const row of self.dlgPost.list) {
            if (!row.item) {
              this.$notify({ title: '失败', message: '消费项目不能为空', type: 'error', duration: 1000 })
              return false
            }
            row.discription = row.item
          }

          this.$confirm('保存后将无法撤销', '确认保存？', { type: 'warning' }).then(_ => {
            const billzListJson = JSON.stringify(self.dlgPost.list)
            addBillz({ orderNo: self.tabDetail.currentOrderNo, billzListJson: billzListJson }).then(response => {
              this.$notify({
                title: '成功',
                message: '入账成功',
                type: 'success',
                duration: 1000
              })
              self.dlgPost.visible = false
              self.tabDetail.getBillDetail()
            })
          })
        }
      },

      /* 付款 */
      dlgPayment: {
        visible: false,
        list: [],
        addRow: () => { // 新增行
          const data = createBillz(2)
          self.dlgPayment.list.push(data)
        },
        delRow: (row) => { // 移除行
          for (const item of self.dlgPayment.list) {
            if (item.id === row.id) {
              const index = self.dlgPayment.list.indexOf(item)
              self.dlgPayment.list.splice(index, 1)
              break
            }
          }
        },
        onSave: () => { // 入账
          for (const row of self.dlgPayment.list) {
            if (!row.payment) {
              this.$notify({ title: '失败', message: '付款方式不能为空', type: 'error' })
              return false
            }
            if (!row.account) {
              this.$notify({ title: '失败', message: '账户不能为空', type: 'error' })
              return false
            }
            row.discription = row.payment
          }

          this.$confirm('保存后将无法撤销', '确认保存？', { type: 'warning' }).then(_ => {
            const billzListJson = JSON.stringify(self.dlgPayment.list)
            addBillz({ orderNo: self.tabDetail.currentOrderNo, billzListJson: billzListJson }).then(response => {
              this.$notify({ title: '成功', message: '入账成功', type: 'success' })
              self.dlgPayment.visible = false
              self.tabDetail.getBillDetail()
            })
          })
        }
      },
    })
    return self
  },
  watch: {
    refreshFlag: function() {
      const billzList = this.tabDetail.billzList
      const list1 = []; const list2 = []; const list3 = []; const list4 = []

      for (const billz of billzList) {
        switch (billz.section) {
          case 1: list1.push(billz); break
          case 2: list2.push(billz); break
          case 3: list3.push(billz); break
          case 4: list4.push(billz); break
          default: break
        }
      }
      this.tabDetail.list1 = list1.sort((one, two) => {
        return one.sortNo - two.sortNo
      })
      this.tabDetail.list2 = list2.sort((one, two) => {
        return one.sortNo - two.sortNo
      })
      this.tabDetail.list3 = list3.sort((one, two) => {
        return one.sortNo - two.sortNo
      })
      this.tabDetail.list4 = list4.sort((one, two) => {
        return one.sortNo - two.sortNo
      })
    } // refreshFlag
  }
}
</script>

<style scoped>

</style>
