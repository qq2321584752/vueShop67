<template>
  <div>
    <crumb nm="订单管理" lb="订单列表"></crumb>

    <el-card class="box-card">
      <!-- 物流信息对话框 -->
      <el-dialog title="物流信息" :visible.sync="orders_Visible" width="40%">
        <!-- <span>这是一段信息</span> -->
        <el-steps direction="vertical" :active="0">
          <el-step :title="item.time" v-for="(item,k) in logistics_list" :key="k" :description='item.context'>
          </el-step>
          <!-- <el-step title="步骤 2"></el-step> -->
          <!-- <el-step title="步骤 3" description="这是一段很长很长很长的描述性文字"></el-step> -->
        </el-steps>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        </span>
      </el-dialog>

      <!-- 搜索框部分 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="querycdt.query"
            placeholder="请输入内容"
            clearable
            @clear="search"
            @keydown.enter.native="search"
          >
            <!--如果是input或者单个的一个标签不用加native修饰,由于这是一个组件占位符，无法具体指定某一个标签执行事件，所以需要修饰符-->
            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <el-table :data="orders_List" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="260"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="info">
            <el-tag type="danger" v-if="info.row.pay_status == 0">未付款</el-tag>
            <el-tag type="success" v-else-if="info.row.pay_status == 1">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">{{ orders_List.update_time | fromat }}</el-table-column>

        <el-table-column label="操作">
          <template slot-scope="info1">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location-outline"
              @click="logistics(info1.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
          @size-change="orders_SizeChange"
          @current-change="orders_CurrentChange"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.get_orders_list()
  },
  data() {
    return {
      querycdt: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      //   表格数组数据
      orders_List: [],
      // 总页数
      total: 0,
      // 对话框开关
      orders_Visible: false,
      // 物流数据列表
      logistics_list:[]
    }
  },
  methods: {
    orders_SizeChange(size) {
      this.querycdt.pagesize = size
      this.get_orders_list()
    },
    orders_CurrentChange(num) {
      this.querycdt.pagenum = num
      this.get_orders_list()
    },

    async get_orders_list() {
      const { data: dt } = await this.$http.get('/orders', {
        params: this.querycdt
      })
      //   赋值到 表格 使用的 数组
      this.orders_List = dt.data.goods
      //   总页数 赋值
      this.total = dt.data.total
      // console.log(dt.data)
    },
    search() {
      this.get_orders_list()
    },
    // 点击弹出物流信息
    async logistics(id) {
      // console.log(id);
      var u_id = id.update_time
      const { data: dt } = await this.$http.get(`/kuaidi/${u_id}`)
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
      this.logistics_list = dt.data
      this.orders_Visible = true
      // console.log(this.logistics_list)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-table,.el-steps {
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
