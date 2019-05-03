<template>
  <div>
    <crumb nm="商品管理" lb='商品管理'></crumb>

    <el-card class="box-card">
      <!-- alert弹出提示信息================================》》 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false"></el-alert>

      <!-- 级联列表==================================》》 -->
      <div class="block">
        <span class="demonstration">选择商品分类：</span>
        <el-cascader
          expand-trigger="hover"
          :options="param_threeList"
          v-model="param_threeSelected"
          @change="param_Change"
          :props="param_threeListProps"
          clearable
          style="width:23%"
        ></el-cascader>
      </div>

      <!-- 标签页==================================>> -->
      <el-tabs v-model="activeName" @tab-click="paramClick">
        <el-tab-pane label="动态属性" name="many">
          <el-button type="primary" size="mini" :disabled="islock">添加参数</el-button>

          <el-table :data="first_Data" border style="width: 100%">
            <template slot-scope="info">
              <el-table-column type="expand" width="40">
                <el-row>
                  <el-col v-for="v in info.row" :key="v.cat_id">{{v.attr_vals}}</el-col>
                </el-row>
              </el-table-column>
              <el-table-column type="index" label="#" width="40"></el-table-column>
              <el-table-column prop="attr_name" label="参数名称"></el-table-column>
              <el-table-column label="操作">
                <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
                <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
              </el-table-column>
            </template>
          </el-table>
        </el-tab-pane>

        <!-- 静态参数======================》 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="islock">添加参数</el-button>

          <el-table :data="second_Data" border style="width: 100%">
            <el-table-column type="expand" width="40">
              <el-row>
                <el-col></el-col>
              </el-row>
            </el-table-column>
            <el-table-column type="index" label="#" width="40"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    //   获取 级联列表的数据
    this.getparma_dialog()
  },
  data() {
    return {
      //   动/静 属性状态
      activeName: 'many',
      // 级联列表 要用的数据
      param_threeList: [],
      // 级联列表 双向的地方 子级option选项的 value值存放的地方
      param_threeSelected: [],
      // 级联列表的 配置项
      param_threeListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },

      //   焦点名字
      //   activeName: '',
      // 动态属性
      first_Data: [],
      // 静态数据
      second_Data: [],
      //   选好的第三级别id
      catThreeId: 0,
      //   默认 添加参数 按钮是禁用的
      islock: true
    }
  },
  methods: {
    async getparma_dialog() {
      // 发送ajax 只拿到 第二层的 权限
      const { data: dt } = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      //   将 获取到的数据 放在 options 属性绑定 要用的数据
      this.param_threeList = dt.data
      //   打开弹出层
      //   console.log(this.param_threeList)
    },
    // 下拉菜单 变化事件
    param_Change() {
      var len = this.param_threeSelected.length
      // 限制只可以 选择第三级别 商品
      console.log(len)

      if (len !== 3) {
        // 禁用按钮
        this.islock = true
        //   清空 存在select 里边的 分类属性值
        this.param_threeSelected = []
        // 清空 第三权限的 的id值
        this.catThreeId = 0
        return false
        console.log(this.islock)
      }

      //   在数组 里边的 第三个 id 拿出来 放在 data 数据里边
      this.catThreeId = this.param_threeSelected[len - 1]
      //   调用ajax 对指定 绑定数组 进行赋值
      this.param_m_o()
    },
    // 发送ajax 拿到 many 或者 only 的数据
    async param_m_o() {
      // 拿到 select 数据存储的 数组的 长度
      //   var len = this.param_threeSelected.length
      // 如果 是第三级别 属性 就会进入到这里 ，最后一项就是 第三级别的id值
      const { data: dt } = await this.$http.get(
        `categories/${this.catThreeId}/attributes`,
        { params: { sel: this.activeName } }
      )
      // 判断 是否是 动态/静态 数据 对他们各自1的数组 进行单独赋值
      if (this.activeName == 'many') {
        this.first_Data = dt.data
      } else {
        this.second_Data = dt.data
      }
      var len = this.param_threeSelected.length
      //   if (len === 3) {
      this.islock = false
      //   }
    },
    // 标签页点击事件
    paramClick() {
      // 点击 调用 发送ajax 拿到 不同的静态或者动态数据
      if (this.catThreeId !== 0) {
        this.param_m_o()
        console.log(this.activeName)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.el-card,
.el-pagination,
.el-table,
.el-cascader {
  margin-top: 15px;
}
</style>
