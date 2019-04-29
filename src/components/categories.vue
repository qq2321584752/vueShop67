<template>
  <div>
    <crumb nm="权限"></crumb>

    <el-card class="box-card">
      <el-dialog title="添加分类" :visible.sync="addcat_dialog" width="50%">

<el-form :model="addcat_form" :rules="addcat_rules" ref="addcat_Form" label-width="100px" class="demo-ruleForm">
  <el-form-item label="活动名称" prop="name">
    <el-input v-model="addcat_form.name"></el-input>
  </el-form-item>
 <el-form-item label="分类上级" prop="name">
  <div class="block">
  <span class="demonstration">hover 触发子菜单</span>
  <el-cascader
    expand-trigger="hover"
    :options="options"
    v-model="catTwoSelected"
    @change="handleChange">
  </el-cascader>
</div>
  </el-form-item>
</el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addcat_dialog = false">取 消</el-button>
          <el-button type="primary" @click="addcat_dialog = false">确 定</el-button>
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
        addcat_rules:{
            name:[
                 { required: true, message: '请输入分类名称', trigger: 'blur' },
            ]
        },
        // 表单数据 存放
        addcat_form:{

        },
        // 级联菜单 数据存放
        catTwoSelected:{

        },
        addcat_dialog:false,//控制弹出层的显示
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

      console.log(dt.data)
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
    addCat_dialog(){
        this.addcat_dialog = true
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
