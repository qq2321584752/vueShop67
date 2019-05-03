<template>
  <div>
    <crumb nm="商品管理" lb="商品列表"></crumb>

    <el-card class="box-card">
      <!-- // 搜索框部分 -->
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
        <el-col :span="7">
          <el-button type="primary" @click="Goodsadd()">添加商品</el-button>

          <!-- 商品表格 -->
          
        </el-col>
      </el-row>
      <el-table :data="goods_List" border style="width: 100%">
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="460"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="add_time" label="创建时间">
              <template slot-scope="info">
              {{info.row.add_time | fromat }}
                
              </template>
            </el-table-column>
          
            <el-table-column label="操作" width="190">
              <template slot-scope="info">
                <el-tooltip class effect="dark" content="修改" placement="left" :enterable="false">
                  <el-button
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    @click="editgoods(info.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip class effect="dark" content="删除" placement="bottom" :enterable="false">
                  <el-button
                    type="danger"
                    size="mini"
                    icon="el-icon-delete"
                    @click="del_goods(info.row.goods_id)"
                  ></el-button>
                </el-tooltip>

                
              </template>
            </el-table-column>

            <!-- <el-table-column prop="create_time" label="日期" width="180"></el-table-column> -->
          </el-table>
          <div class="block">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 15, 1, 25]"
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
    this.getgoods_List()
  },
  data() {
    return {
      // 全部属性列表
      goods_List: [],
      add_time:'',
       querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页显示数据条数
      },
      total:0
    }
  },
  methods: {
    search() {
      // 绑定搜索框数据
      this.getgoods_List()
    },
    handleSizeChange(Size){
      // 点击要显示第几页
      this.querycdt.pagesize = Size
      this.getgoods_List()
    },
    handleCurrentChange(val){
      // 规定一页要显示几条数据
      this.querycdt.pagenum = val
      this.getgoods_List()
    },


    editgoods() {},
     del_goods(goods_id) {
      //  拿到 info.row传来的 id值
       console.log(goods_id);
       
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发送ajax请求
          const {data:dt} = await this.$http.delete(`goods/${goods_id}`)
      if (dt.meta.status !== 200) {
          this.$message.error(dt.meta.msg)
      };
      // 弹出 成功信息
      this.$message.success(dt.meta.msg)
      // 重新拉取数据
      this.getgoods_List()

      
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '那你点我干吗？？'
          });          
        });


      
      
    },
    Assign_goods() {},

    // 获取所有商品属性
   async getgoods_List(){
      const {data:dt} = await this.$http.get('/goods',{params:this.querycdt})
      this.goods_List = dt.data.goods
      
      // this.add_time = dt.data.goods
      this.total = dt.data.total
      console.log(dt);
      
    },
    Goodsadd(){
      this.$router.push('/GoodsAdd')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card,.el-table {
  margin-top: 15px;
}
.el-table {
  font-size: 12px;
}
</style>
