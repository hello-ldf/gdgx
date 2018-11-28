<template>
  <div class="board-column">
    <div class="board-column-header">
      ￥ {{ total }}
    </div>
    <el-row class="board-column-header2">
      <el-col :sm="6">日期</el-col>
      <el-col :sm="6">描述</el-col>
      <el-col :sm="6">金额</el-col>
      <el-col :sm="6">备注</el-col>
    </el-row>
    <draggable :list="list" :options="options" class="board-column-content" @sort="onSort">
      <el-row v-for="element in list" :key="element.id" class="board-item">
        <el-col :sm="6">{{ element.createDate | parseTime('{y}-{m}-{d}') }}</el-col>
        <el-col :sm="6">{{ element.discription }}</el-col>
        <el-col :sm="6">{{ element.type===2 ? -element.amount : element.amount }}</el-col>
        <el-col :sm="6">{{ element.remark }}</el-col>
      </el-row>
      <!-- <div v-for="element in list" :key="element.id" class="board-item">
        {{ element.name }} {{ element.id }}
      </div> -->
    </draggable>

  </div>
</template>
<script>
import { sortBillz } from '@/api/bill'
import draggable from 'vuedraggable'
// import { parseTime } from '@/utils'

export default {
  name: 'BillPanel',
  components: {
    draggable
  },
  props: {
    section: {
      type: Number,
      default() { return 0 }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  computed: {
    total: vm => {
      let temp_total = 0
      // console.log(vm)
      for (const item of vm.list) {
        temp_total += parseInt(item.type === 2 ? -item.amount : item.amount)
      }
      return temp_total
    }
  },
  methods: {
    onSort: function(evt) {
      const section = this.section
      let counter = 0
      for (const billz of this.list) {
        counter++
        billz.sortNo = counter
        billz.section = section
      }
      sortBillz({ billzListJson: JSON.stringify(this.list) })
    }
  },
}
</script>
<style lang="scss">
.board-column {
  min-width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;
  margin: 0 5px;
  border: 1px #333 solid;

  .board-column-header {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    // padding: 0 20px;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-header2 {
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    padding: 0 20px;
    // text-align: center;
    background: #fff;
    // color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: 200px;
    // height: auto;
    overflow-y:auto;
    overflow-x: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      height: 24px;
      // margin: 5px 0;
      background-color: #fff;
      text-align: left;
      line-height: 24px;
      // padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0,0,0,0.2);

    }
    .board-item.sortable-chosen {
      background: #4AB7BD;
    }
    .board-item.sortable-ghost {
      background: #30B08F;
    }

    // .list-complete-item

    // .list-complete-item
  }
}
</style>

