<template>
  <div>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <crumb nm="权限管理" lb='权限管理'></crumb>

    <el-card class="box-card">
      <el-table :data="rightslist" border style="width: 100%">
        <el-table-column type="index" label="序号" width="160"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径" width="200"></el-table-column>
        <el-table-column prop="level" label="等级" width="200">
            <template slot-scope="info">
                <el-tag v-if="info.row.level == 0">一级</el-tag>
                <el-tag type="warning" v-else-if="info.row.level == 1">二级</el-tag>
                <el-tag type="danger" v-else>三级</el-tag>
            </template>
        </el-table-column>
        

        <!-- <el-table-column prop="create_time" label="日期" width="180"></el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    created(){
        this.getrightslist()
    },
    data(){
        return {
            rightslist:[]
        }
    },
    methods:{
        async getrightslist(){
            var {data:dt} = await this.$http.get('/rights/list')
            if (dt.meta.status !== 200) return this.$message.error(dt.meta.msg)
            this.rightslist = dt.data
            console.log(dt);
            
        }
    }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-top: 15px;
}
.el-table {
    font-size: 12px;
}
</style>
