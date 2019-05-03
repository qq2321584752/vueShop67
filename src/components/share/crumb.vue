<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ nm }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ lb }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    props:['nm','lb']
}
</script>

<style lang="less" scoped>
</style>
