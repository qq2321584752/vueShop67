<template>
  <el-container>
    <el-header>
      <div class="log-box">
        <img src="../assets/images/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="retreat">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="mentflag? '65px':'200px'">
          <div class="nav_bar" @click="isshow">
              |||
          </div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"

          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened='true'
          :collapse='mentflag'
          :collapse-transition='false'
          :router='true'
          
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in mentlist" :key="item.id" style="width:200px">
            <template slot="title">
              <i :class="'iconfont icon-'+icon[k]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- <el-menu-item-group> -->
              <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
                  <i class="el-icon-menu"></i>
                  <span>
                  {{ item2.authName }}

                  </span>
              </el-menu-item>
            <!-- </el-menu-item-group> -->
       
          </el-submenu>

          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
              <el-menu-item index="2-1">选项3</el-menu-item>
              <el-menu-item index="2-2">选项4</el-menu-item>
       
          </el-submenu> -->
   
        </el-menu>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    created(){
      this.list()
        
    },
    data(){
        return {
            icon:['users','tijikongjian','shangpin','danju','baobiao'],
            mentlist:[],
            mentflag:false

        }
    },
    methods:{
        isshow(){
            this.mentflag = !this.mentflag
        },
        async list(){
        var {data:dt} = await this.$http.get('/menus')
        console.log(dt);
            this.mentlist = dt.data
        },
        retreat(){
            this.$confirm('此操作将退出后台, 是否继续?', '退出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            window.sessionStorage.removeItem('token')
            this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '那你tm 点我干嘛？ 有病'
          });          
        });
      
        }
    }
}
</script>

<style lang="less" scoped>
.el-submenu__title {
    font-size: 5px;
}

.nav_bar {
    text-align: center; 
    height: 25px;
    line-height: 25px;
    background: #4a5064;
    color: #fff;
    font-size: 12px;
    // letter-spacing:1px;
    letter-spacing:0.1em;
    user-select: none;
    cursor: pointer;
}
.el-menu {
    border: 0;
}
.el-container {
  height: 100%;
  .el-header {
      user-select: none;
    background: #373b41;
    padding: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-button {
      margin-right: 20px;
    }
    .log-box {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
      }
      span {
        font-size: 22px;
        color: #fff;
        margin-left: 10px;
      }
    }
  }
  .el-aside {
    background: #333744;
  }
  .el-main {
    background: #eaedf1;
  }
}
</style>
