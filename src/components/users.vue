<template>
  <div>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <crumb nm="用户管理" lb='用户管理'></crumb>

    <el-card class="box-card">
      <!-- 添加用户弹出层 =========================================================-->
      <el-dialog title="添加用户" :visible.sync="add_userdialog" width="50%" @close="addDialogClose">
        <!-- <span>这是一段信息</span> -->
        <!-- 这里放表单元素 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="add_userdialog = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div> -->
      <!-- 修改用户信息弹出层 =========================================-->
      <el-dialog title="修改信息" :visible.sync="edit_dialog" width="40%">
        <!-- <span>这是一段信息</span> -->
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" :disabled="true"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="edit_dialog = false">取 消</el-button>
          <el-button type="primary" @click="edit_ok">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色弹出层 ======================================-->
      <el-dialog @close="assignDialogClose" title="用户分配角色" :visible.sync="Assign_users" width="50%">
        <el-form
          :rules="setrolerules"
          label-position
          ref="assign_form1"
          :model="assign_form"
          label-width="100px"
        >
          <el-form-item label="当前的用户">
            <span v-text="assign_form.username"></span>
          </el-form-item>
          <el-form-item label="当前的角色">
            <span v-text="assign_form.role_name"></span>
          </el-form-item>

          <el-form-item label="分配新角色" prop="rid">
            <el-select v-model="assign_form.rid" placeholder="请选择活动区域">
              <el-option
                placeholder="请选择"
                v-for="item in assign_region"
                :key="item.id"
                :value="item.id"
                :label="item.roleName"
              ></el-option>
              <!-- <el-option label="区域二" value="beijing"></el-option> -->
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="Assign_users = false">取 消</el-button>
          <el-button type="primary" @click="assign_ok">确 定</el-button>
        </span>
      </el-dialog>
      
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
          <el-button type="primary" @click="add_userdialog = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- table 用户列表表格 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="420"></el-table-column>
        <el-table-column prop="mobile" label="手机号"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="80">
          <el-switch
            slot-scope="info"
            v-model="info.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change='user_status(info.row.id,info.row.mg_state)'
          ></el-switch>
          <!-- <span slot-scope="info">{{ info.row }}</span> -->
        </el-table-column>
        <el-table-column label="操作" width="190">
          <template slot-scope="info">
            <el-tooltip class effect="dark" content="修改" placement="left" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="editUser(info.row)"></el-button>
            </el-tooltip>
            <el-tooltip class effect="dark" content="删除" placement="bottom" :enterable="false">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="del_user(info.row.id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip class effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="Assign_role(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="create_time" label="日期" width="180"></el-table-column> -->
      </el-table>
      <!-- 分页栏 -->
      <div class="block">
        <!-- <span class="demonstration">完整功能</span> -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="querycdt.pagenum"
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
    this.getuserlist()
  },

  data() {
    // 自定义用来 验证手机号的规则
    var checkMobile = (rules, value, callback) => {
      if (!/^1[3,5,7,8,9]\d{9}$/.test(value)) {
        return callback(new Error('请填写规范手机号'))
      }
      callback()
    }
    return {
      // 所有用户数据列表
      userList: [],
      // 角色种类
      assign_region: [],

      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页显示数据条数
      },
      total: 0,
      add_userdialog: false, //默认添加用户的对话框是关闭的
      edit_dialog: false, //默认修改用户的对话框是关闭的
      Assign_users: false, //默认分配用户的对话框是关闭的
      // 表单数据对象，表单获取的数据都放在这里边
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      // 修改表单数据对象
      editForm: {
        email: '',
        mobile: '',
        username: '',
        id: 0
      },
      assign_form: {
        assign_reast: ''
      },
      assign_region2: '',

      // 表单验证的规则
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        email: [{ required: true, message: '邮箱必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' } //第一种自定义验证方法
          // {}
        ]
      },
      // 分配角色验证规则
      setrolerules:{
       rid: [
          {required:true,message:'请选择一个角色',trigger:'change'}
        ]
      }
    }
  },
  methods: {
    // 异步获取 列表数据 同时分解 promise 对象 ，
    // 进行结构赋值
    async getuserlist() {
      var { data: dt } = await this.$http.get('/users', {
        params: this.querycdt
      })
      // 把 获取到的用户数据 拿到里边的 数组赋值到表格需要 进行v-for的 数组里边去
      this.userList = dt.data.users
      // this.querycdt.pagenum = dt.data.pagenum
      // 总共有几条数据 赋值到 total 属性里边
      this.total = dt.data.total

      // var n_date = ''
      // for ( var i = 0 ; i < this.userList.length ; i++){
      //   n_date = this.userList[i].create_time
      //   this.userList[i].create_time = new Date(n_date).toLocaleString()

      // }
    },
    // 点击 切换 多少数据放一页的时候 触发的事件 它的形参的 值就是要多少数据显示在一页 （默认是3）
    handleSizeChange(val) {
      this.querycdt.pagesize = val
      this.getuserlist()
    },
    // 点击 切换分页的 时候 触发的事件 ，它的参数 是当前所在的分页的 位置number类型
    // 通过他提供的 分页数来显示第几页的 数据
    handleCurrentChange(val) {
      this.querycdt.pagenum = val
      this.getuserlist()
      // console.log(val);
    },
    // 搜索框
    search() {
      // console.log(this.querycdt.query);
      // 这次的search 方法 使用的 时候 会带着 关键字去 发送到后端
      // 后端会根据提供的 关键字 来返回相应的数据
      // 再点击清空 标记的时候 输入框被清空 空字符串会把所有的数据找到
      this.getuserlist()
    },
    // 关闭添加用户弹出层
    addDialogClose() {
      // 谁执行这个方法 都会通过refs 拿到 该表单对象 然后调用方法 清空表单
      this.$refs.addFormRef.resetFields()
    },
    // 关闭分配角色弹出层
    assignDialogClose() {
      // 谁执行这个方法 都会通过refs 拿到 该表单对象 然后调用方法 清空表单

      this.$refs.assign_form1.resetFields()
      console.log(this.assign_form)

      console.log(this.$refs.assign_form1)
    },
    // 点击添加 用户的方法
    addUser() {
      // 拿到这个表单对象返回的 验证的结果 其形参就是 验证的结果 布尔值
      this.$refs.addFormRef.validate(async vali => {
        if (vali) {
          // 发送 ajax请求 解析promise 对象 发送的 addFrom 对象 里边的键值对形式正好符合 后端的要求
          var { data: dt } = await this.$http.post('/users', this.addForm)
          // 添加成功后 会返回一些信息 201为添加成功
          if (dt.meta.status === 201) {
            // 弹出提示
            this.$message.success(dt.meta.msg)
            // 重新拉去列表数据
            this.getuserlist()
            // 关闭弹出层
            this.add_userdialog = false

            console.log(dt)
          } else {
            // 失败提醒
            this.$message.error(dt.meta.msg)
          }
        }
      })
    },
    // 删除指定用户
    del_user(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          var { data: dt } = await this.$http.delete('/users/' + id)

          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 如果删除数据的时候 只有一条数据 则 将显示的页数-1
          if (this.userList.length == 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          this.getuserlist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '你闲的吧你 ，点我干嘛'
          })
        })
    },
    // 修改用户信息
    async editUser(edit) {
      this.edit_dialog = true
      // this.editForm.username = edit.username
      // this.editForm.email = edit.email
      // this.editForm.mobile = edit.mobile
      // this.editForm.id = edit.id

      var id = edit.id

      var { data: dt } = await this.$http.get('/users/' + id)
      if (dt.meta.status !== 200) return this.$message.error(dt.meta.msg)
      this.editForm = dt.data
    },
    // 确认修改 用户信息并提交
    edit_ok() {
      // 检查表单的 验证
      this.$refs.editFormRef.validate(async vali => {
        if (vali) {
          // 一定要注意不要 写错单词
          // 发送ajax 传入指定的id值 ， 和修改的参数
          var { data: dt } = await this.$http.put(
            '/users/' + this.editForm.id,
            this.editForm
          )
          // 当修改 失败时 打断弹出失败信息
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 弹出成功信息
          this.$message.success(dt.meta.msg)
          // 关闭弹出框
          this.edit_dialog = false
          // 重新获取数据
          this.getuserlist()
          console.log(dt)
        }
      })
    },
    // 分配角色弹出层显示
    async Assign_role(row) {
      // 拿到 所有 角色 名称
      var { data: dt } = await this.$http.get('/roles')
      // 那他到 data里边 select需要 循环的 数据
      this.assign_region = dt.data
      // console.log(dt);
      // 弹出框 一弹出 的时候 就自带显示 现角色名称和 用户名
      this.assign_form = row
      // 开启弹出框
      this.Assign_users = true
    },
    // 提交分配角色的结果
    assign_ok() {
      // 拿到 当前 获得的 用户信息里边的id值
      var id = this.assign_form.id
      //! 判断 表单验证 注意async 的位置 很重要！必须要在 vali 为true的 情况下操作
      this.$refs.assign_form1.validate(async vali => {
        if (vali) {
          // 用户id值 放在路由里边
      // 角色id 通过参数rid 传过去
      var { data: dt } = await this.$http.put('/users/' + id + '/role', {
        rid: this.assign_form.rid
      })
      this.$message.success(dt.meta.msg)
      // 重新拉去 用户最新数据
      this.getuserlist()
      // 清空 表单
      this.assignDialogClose()
      // 关闭弹出层
      this.Assign_users = false
        }
        console.log(vali);
        
      })
      
    },
    // 改变用户 状态
    async user_status(id,mg_state){
      const {data:dt} = await this.$http.put(`users/${id}/state/${mg_state}`)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
        
      }
      this.$message.success(dt.meta.msg)
      // console.log(dt);
      
      // console.log(id,mg_state);
      
    }
  }
}
</script>

<style lang="less" scoped>
.el-pagination {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.box-card {
  min-width: 742px;
}
// .search {
//     width: 392.8px;
//     .el-input {
//         width: 100%;
//     }
// }
.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
  margin-top: 15px;
}
</style>
