<template>
  <div>
    <crumb nm="权限"></crumb>

    <el-card class="box-card">
      <el-dialog title="分配权限" :visible.sync="distributeDialog" width="50%">
        <!-- <span>这是一段信息</span> -->
        <!-- 这里放表单元素 -->
        <el-form
          :model="DistributeForm"
          ref="distributeRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="角色名" prop="roleName">
            <!-- <el-input v-model="DistributeForm.roleName"></el-input> -->
            <h3>{{ DistributeForm.roleName }}</h3>
          </el-form-item>

          <el-form-item>
            <el-tree
              :data="treedata"
              show-checkbox
              node-key="id"
              :props="treeProps"
              default-expand-all
              :default-checked-keys="deFaultCheckedKeys"
              ref="treeRef"
            ></el-tree>
          </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialog = false">取 消</el-button>
          <el-button type="primary" @click="distribuet">确 定</el-button>
        </span>
      </el-dialog>

      <el-row>
        <el-button type="primary" round>添加角色</el-button>
      </el-row>
      <el-table :data="roleslist" border style="width: 100%">
        <!-- expand 添加一个 可以展开的选项 -->
        <el-table-column type="expand" width="60">
          <template slot-scope="info">
            <el-row
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)','border-top':k==0?'1px solid rgb(235, 238, 245)':''}"
              :gutter="20"
              v-for="(v,k) in info.row.son"
              :key="v.id"
            >
              <el-col :span="5">
                <el-tag @close="del_rights(info.row,v.id)" closable>{{ v.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row
                  :style="{'border-top':'1px solid rgb(235, 238, 245)','border-top':k==0?'':'1px solid rgb(235, 238, 245)'}"
                  v-for="(vv,k) in v.children"
                  :key="vv.id"
                >
                  <el-col :span="6">
                    <el-tag
                      @close="del_rights(info.row,vv.id)"
                      closable
                      type="success"
                    >{{ vv.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="18">
                    <el-tag
                      @close="del_rights(info.row,vvv.id)"
                      closable
                      type="warning"
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                    >{{ vvv.authName }}</el-tag>
                    <!-- <i class="el-icon-caret-right"></i> -->
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="240"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="info1">
            <el-tooltip class effect="dark" content="修改" placement="left" :enterable="false">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            </el-tooltip>
            <el-tooltip class effect="dark" content="删除" placement="bottom" :enterable="false">
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-tooltip>

            <el-tooltip class effect="dark" content="修改权限" placement="top" :enterable="false">
              <el-button
                @click="showDistributDialog(info1.row)"
                type="warning"
                size="mini"
                icon="el-icon-setting"
              >修改权限</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="create_time" label="日期" width="180"></el-table-column> -->
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getroleslist()
  },
  data() {
    return {
      // 权限数据列表
      roleslist: [],
      // 默认 展开权限树时的 选中项
      deFaultCheckedKeys: [],

      //   显示弹出层的指定用户名
      DistributeForm: {},
      // 控制弹出层的显示
      distributeDialog: false,
      // 存放 权限树 数据的地方
      treedata: [],
      // 权限树 定义数据
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  methods: {
    async getroleslist() {
      // 因为 饿了吗 组件库 里边的 table 表格 也要应用这个children 属性所以产生了冲突出现报错
      let { data: dt } = await this.$http.get('/roles')
      // 遍历里边的 数组数据 item就是 里边的每一小项，点上一个son属性， 将children里边的数组都复制到里边
      dt.data.forEach(item => {
        item.son = item.children
        // 然后 再循环里边把 每一项原有的 children 属性删除
        delete item.children
      })
      // dt.data.son = dt.data.children
      // console.log(dt)
      this.roleslist = dt.data
    },
    // 传入
    // roleId的是 info.row 数据信息
    // rightId 是 每一项小标签的 id值 根据该id值 来决定删除那个标签
    del_rights(roleId, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送ajax通过 路由 带参数的 形式把两个id值传过去
          // 第一个id 值 决定要删除 那个角色的权限
          // 第二个id 值 决定 要删除那个 权限标签
          let { data: dt } = await this.$http.delete(
            `/roles/${roleId.id}/rights/${rightId}`
          )
          if (dt.meta.status != 200) {
            return this.$message.success(dt.meta.msg)
          }
          // console.log(dt);
          // console.log(roleId);
          // 删除之后 返回的是 这个角色 新的 权限状态
          // 与 info.row的 形式 一样 ， 直接把这个值 改变到 该角色的权限对象
          roleId.son = dt.data
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })

      // this.roleslist = dt.data
      // console.log(roleId);
      // console.log(rightId);
    },
    // 分配权限时 弹出修改权限的 角色
    showDistributDialog(info) {
      // 权限树 数据获取
      this.get_treedata()
      // 数组里边存放着 要默认被选中的选项
      var arr = []
      // 在点击 权限树的时候 拿到 要默认选择的选项
      // 传入 一个当前的 权限对象 里边有他所有现有的 权限
      this.getHaveRights(info, arr)
      // 在数值计算完毕之后 将获得的值 放到data 数据里边
      this.deFaultCheckedKeys = arr
      // console.log(this.deFaultCheckedKeys);

      // 绑定权限树 的 数据
      this.DistributeForm = info
      // 打开弹出层
      this.distributeDialog = true
      // console.log(this.DistributeForm)
    },
    // 递归遍历
    getHaveRights(role, arr) {
      // 如果 发现那个属性的名字叫 son的话 ，把里边的内容 放到
      // 名为children的属性里边
      if (role.son) {
        role.children = role.son
      }
      // 如果那个 数据结构里边 没有 children属性的时候 说明到了最后
      // 第三道权限
      if (!role.children) {
        // 拿到 最后 权限里的 唯一 id值 push 到空数组里边
        return arr.push(role.id)
      }
      // 没有到最后一项 权限的children 就拿出 里边的 每一项再 去遍历
      role.children.forEach(item => {
        // 每次返回的是 一次 函数自调用
        return this.getHaveRights(item, arr)
      })
    },
    // 发送ajax拿到 权限树 数据
    async get_treedata() {
      const { data: dt } = await this.$http.get('/rights/tree')
      this.treedata = dt.data
      // console.log(this.treedata)
    },
    // 点击提交按钮向 后端发送 被选中的 叶子节点信息 和 半选中的 节点 (key值)
    async distribuet() {
      // console.log(this.$refs.treeRef);

      var ikey = this.$refs.treeRef.getCheckedKeys()
      var bkey = this.$refs.treeRef.getHalfCheckedKeys()
      // concat数组的方法 可以将 两个数组 拼接在一起
      // join数组的方法 可以 让 一个数组变为一个 字符串,每一项 自定义用 什么字符拼接在一起
      var Merge_key = ikey.concat(bkey).join(',')
      // console.log(this.DistributeForm);

      const { data: dt } = await this.$http.post(
        `roles/${this.DistributeForm.id}/rights`,
        {
          rids: Merge_key
        }
      )
      // 检查错误
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 弹出成功信息
      this.$message.success(dt.meta.msg)
      // 关闭 分配权限弹出层
      this.distributeDialog = false
      // console.log(dt);
      // console.log(Merge_key);
    }
  }
}
</script>

<style lang="less" scoped>
.el-card,
.el-table {
  margin-top: 15px;
  min-width: 1024px;
}
h3 {
  margin: 0;
}
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
  //   border-bottom: 1px solid #000;
}
.el-table {
  font-size: 12px;
  // display: flex;
}
</style>
