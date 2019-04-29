<template>
  <div class="login-container">
    <h2>管理员登录系统</h2>
    <div class="login-box">
      <div class="logo-box">
        <img src="../assets/images/logo.png" alt>
      </div>

      <div id="login-container">
        <div id="login-box">
          <el-form :rules="loginFormRules" ref="form" :model="loginForm">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username">
                <i slot="prefix" class="iconfont icon-user"></i>
              </el-input>
            </el-form-item>

            <el-form-item prop="password">
              <el-input v-model="loginForm.password">
                <i slot="prefix" class="iconfont icon-3702mima"></i>
              </el-input>
            </el-form-item>

            <el-row type="flex" tag="div" justify="space-between">
              <!-- <el-col  :push='15'> -->
              <el-button type="primary" @click="login">登录</el-button>
              <el-button type="info" @click="resetForm">重置</el-button>
              <!-- </el-col> -->
            </el-row>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 规则对象 ， 绑定在 form表单的 rules 上
      // 每一个针对的 判断是数组 条件是对象 键值对形式的
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loginForm: {
        username: 'admin',
        password: '123456'
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields()
      //    console.log(123);
    },

    login() {
      this.$refs.form.validate(async vail => {
        if (vail === true) {
          var { data: dt } = await this.$http.post('/login', this.loginForm)
          console.log(dt)

          if (dt.meta.status === 400) {
            return this.$message.info(dt.meta.msg)
          } else if (dt.meta.status === 200) {
            this.$message.success('登录成功')
            // 一定要先拿到 sessionStorage之后 给到路由守卫 去判断
            // 之后 再去 改变 锚点值 不认需要在 第二次点击的 时候 才可以改变路由
            window.sessionStorage.setItem('token', dt.data.token)
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
.login-container {
  background: #2b4b6b;
  height: 100%;
  width: 100%;
  overflow: hidden;
  .login-box {
    background: #fff;
    width: 450px;
    height: 304px;
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .logo-box {
    width: 130px;
    height: 130px;
    overflow: hidden;
    border-radius: 50%;
    padding: 8px;
    position: absolute;
    left: 50%;
    // top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    box-shadow: 0 0 10px #eee;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #eee;
    }
  }
}
// npm install element-ui
</style>
