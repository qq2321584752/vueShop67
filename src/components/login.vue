<template>
    <div class="login-container">
        <h2>管理员登录系统</h2>
        <div class='login-box'>
            <div class="logo-box">
                <img src="../assets/logo.png" alt="">
            </div>

            <div id="login-container">
    <div id="login-box">
     
            <el-form ref="loginFormRef" :model="loginForm">
                <el-form-item>
                <el-input v-model="loginForm.username">
                    <i slot='prefix' class="iconfont icon-user"></i>
                </el-input>
                </el-form-item>
                <el-form-item>
                <el-input type="password" v-model="loginForm.password">
                    <i slot="prefix" class="iconfont icon-3702mima"></i>
                </el-input>
                </el-form-item>
                <el-row>
                <el-col :offset="15">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-col>
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
            loginForm:{
                username:'admin',
                password:'123456'
            }
        }
    },
    methods: {
      resetForm(){
           this.loginForm.username = '' ;
           this.loginForm.password = ''
        //    console.log(123);
           
      }  
    },
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
    background:#2b4b6b ;
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
        transform: translate(-50%,-50%)
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
        transform: translate(-50%,-50%);
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
