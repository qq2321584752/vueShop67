<template>
  <div>
    <crumb nm="权限管理" lb='权限管理'></crumb>

    <el-card class="box-card">
      <el-dialog title="添加分类" :visible.sync="addcat_dialog" width="50%" @close='addCatDialogClose'>
        <el-form
          :model="addcat_form"
          :rules="addcat_rules"
          ref="addcat_Form"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="活动名称" prop="cat_name">
            <el-input v-model="addcat_form.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <div class="block">
              <!-- <span class="demonstration">hover 触发子菜单</span> -->
              <el-cascader
                expand-trigger="hover"
                :options="catTwoList"
                v-model="catTwoSelected"
                @change="catChange"
                :props="catTwoListProps"
                change-on-select
                clearable
                style="width:100%"
              ></el-cascader>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addcat_dialog = false">取 消</el-button>
          <el-button type="primary" @click="tijiao()">确 定</el-button>
        </span>
      </el-dialog>

      <el-button type="primary" @click="addCat_dialog()">添加分类</el-button>
      <el-table :data="cat_List.result" row-key="cat_id" stripe border style="width: 100%">
        <!-- <el-table-column type="index" label="序号" width="60"></el-table-column> -->
        <el-table-column prop="cat_name" label="用户名" width="420"></el-table-column>
        <el-table-column prop="cat_level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.cat_level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.cat_level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="mg_state" label="操作" width="240">
          <el-row>
            <el-button type="primary" size="mini">
              <i class="el-icon-edit"></i>
              编辑
            </el-button>
            <el-button type="danger" size="mini">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
          </el-row>
          <!-- <span slot-scope="info">{{ info.row }}</span> -->
        </el-table-column>

        <!-- <el-table-column prop="create_time" label="日期" width="180"></el-table-column> -->
      </el-table>

      <div class="block">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
          @size-change="cat_SizeChange"
          @current-change="cat_CurrentChange"
          :page-sizes="[3, 10, 20, 30]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="cat_List.total"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getcat_List()
  },
  data() {
    return {
      // 添加分类 时的 规则
      addcat_rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 表单数据 存放
      addcat_form: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      // 级联菜单 数据存放
      catTwoSelected: [],
      // 级联菜单要使用的数据
      catTwoList: [],
      //   级联菜单到的 配置 选项
      catTwoListProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addcat_dialog: false, //控制弹出层的显示
      // 全部数据数组
      cat_List: [],
      cat_page: {
        pagenum: 1,
        pagesize: 3
      }
    }
  },
  methods: {
    async getcat_List() {
      const { data: dt } = await this.$http.get('/categories', {
        params: this.cat_page
      })
      this.cat_List = dt.data

      //   console.log(dt.data)
    },
    cat_SizeChange(Size) {
      this.cat_page.pagesize = Size
      this.getcat_List()
    },
    cat_CurrentChange(num) {
      this.cat_page.pagenum = num
      this.getcat_List()
    },

    // 添加新分类按钮
    async addCat_dialog() {
      // 发送ajax 只拿到 第二层的 权限
      const { data: dt } = await this.$http.get('/categories', {
        params: { type: 2 }
      })
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      //   将 获取到的数据 放在 options 属性绑定 要用的数据
      this.catTwoList = dt.data
      //   打开弹出层
      this.addcat_dialog = true
      //   console.log(this.catTwoList);
    },
    // 级联菜单 变化时的 回调函数
    catChange() {
      //   console.log(this.catTwoSelected);
    },
    // 提交分类
    tijiao() {
      this.$refs.addcat_Form.validate(async vali => {
        if (vali) {
            // 拿到 下拉菜单 储存的 数据的长度 ，数组里边放着 该选项的所有分类id值(这里 是二级菜单 只会有 两个id值放在数组里边)
          var len = this.catTwoSelected.length
        //   如果记录id的数组 里边 没有 id值 就没有长度 ， 此时分类名称 有值的话 就证明 要创建一级分类(根级分类)
          if (len != 0) {
            //   它 ajax 要拿到 该新分类的 父级分类的 id值 就是当前 所在分支的id值(你还没有 创建该分类不会有 id值)
            this.addcat_form.cat_pid = this.catTwoSelected[len - 1]
            // 等级 和 长度 刚好一致
            this.addcat_form.cat_level = len
          } else {
            //   不选择 分类 则会 创建一个根分类 不会有 父分类  等级为 0级最大
            this.addcat_form.cat_pid = 0
            this.addcat_form.cat_level = 0
          }

          // console.log(vali);
          // console.log(this.addcat_form);

          // return
        //   发送ajax 请求 参数 
        // 分类名称和 input 框 是双向数据 绑定， 绑在要提交的对象的属性上
        // 再点击的时候 发送ajax之前 会把 父级id 值 和 等级计算好
        // 直接 传入 对象就可以
          const { data: dt } = await this.$http.post(
            '/categories',
            this.addcat_form
          )

          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
        //   清空表单
        //   this.addCatDialogClose()
        //   关闭弹出层
          this.addcat_dialog = false
          console.log(dt)
        }
      })
    },
    // 清空添加分类的表单
    addCatDialogClose(){
        // 在关闭 弹出层 的时候 执行清表单的这个函数
        this.$refs.addcat_Form.resetFields()  //清掉 分类名称的input框
        this.catTwoSelected = []            // 清除 select 的 value值 来源 与这个数组个 给到一个空数组
        this.addcat_form.cat_pid = 0        // 将 之前存在的 父类 id 值 和 等级
        this.addcat_form.cat_level = 0
        // console.log(this.addcat_form.cat_name);
        
        // console.log(this.addcat_form);
        
        
    }
  }
}
</script>

<style lang="less" scoped>
.el-card,
.el-pagination,
.el-table {
  margin-top: 15px;
}
</style>
