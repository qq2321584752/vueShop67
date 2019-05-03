<template>
  <div>
    <crumb nm="商品列表" lb="添加商品"></crumb>

    <el-card>
      <!-- 提示信息 -->
      <el-alert title="消息提示的文案" type="info" center show-icon :closable="false"></el-alert>
      <!-- 横向进度信息=======================================》》 -->
      <el-steps align-center :space="200" :active="schedule-0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 纵向 tabs 标签切换=========================================》》 -->
      <!-- 所有 单项都被 一个最大的 from 表单包住 -->
      <el-form label-width="100px" :model="goods_Form" :rules="goods_rules" ref="goods_ruleForm">
        <el-tabs
          :before-leave="before_click"
          @tab-click="tab_switch"
          v-model="schedule"
          tab-position="left"
          style="height: 100%;"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goods_Form.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goods_Form.goods_price"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goods_Form.goods_weight"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goods_Form.goods_number"></el-input>
            </el-form-item>

            <el-form-item label="商品分类" prop="abc">
              <!-- <div class="block"> -->
              <!-- <span class="demonstration">商品分类</span> -->
              <el-cascader
                expand-trigger="hover"
                :options="goods_options"
                v-model="goods_data_selected"
                :props="goods_data"
                @change="goods_handleChange"
                clearable
              ></el-cascader>
              <!-- </div> -->
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in Parameter" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border v-for="(item2,k) in item.attr_vals" :key="k" :label="item2"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              label-width="150px"
              :label="item.attr_name"
              v-for="item in Static_attribute"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- <el-form-item> -->
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:11333/api/private/v1/upload"
              :headers="headers"
              list-type="picture"
              :on-preview="pre_click"
              :on-remove="rem_click"
              :on-success="succ_click"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <!-- </el-form-item> -->
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <el-form-item label-width="0">
              <quill-editor class="editor" v-model="goods_Form.goods_introduce"></quill-editor>
               
            </el-form-item>
            <el-button type="primary" @click="add_goods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  created() {
    this.getCatList()
  },
  // goods_cat
  // goods_price
  // goods_name
  // goods_number
  // goods_weight
  // goods_introduce
  // pics
  // attrs

  data() {
    return {
      // 表单数据绑定
      goods_Form: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
        abc: ''
      },
      // 表单规则
      goods_rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        abc: [{ required: true, message: '请输入商品重量', trigger: 'blur' }]
      },
      // 级联 表要用的数据
      goods_options: [],
      // 级联列表的数据存放
      goods_data_selected: [],
      // 级联表 链接 配置项
      goods_data: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 要和 纵向共用 进度信息
      schedule: '0',
      // =========================================》》
      // 商品参数要是用的 动态数据数组
      Parameter: [],
      // 商品参数要是用的 静态数据数组
      Static_attribute: [],
      // ============================================>>
      // 上传 文件图片的 headers 设置请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },

  methods: {
    // 添加 大表单数据
    async add_goods(){
      // 原来的存放 级联列表的数组 把里边的 数组形式的 数据 转换为 字符串形式
      this.goods_Form.goods_cat = this.goods_data_selected.join(',')
      // console.log(this.Parameter);
      // console.log(this.Static_attribute);

      // 判断 静态 或者 动态的 数据 存放的 地方 有没有 数据
      if (this.Parameter.length === 0 || this.Static_attribute.length === 0) return false
      // 分解 动态数据
      this.Parameter.forEach( item => {
        
        let obj = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(',')
        }
        this.goods_Form.attrs.push(obj)

      } )
      // 分解静态数据
      this.Static_attribute.forEach( item => {
        
        let obj = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        }
        this.goods_Form.attrs.push(obj)
        
      } )
      

      const {data:dt} = await this.$http.post('/goods',this.goods_Form)
      this.goods_Form.goods_cat = []
      // this.goods_Form.attrs
      // console.log(this.goods_Form.goods_cat);
      
      // console.log(dt);

      // 在商品 属性 完成 后 判断 数据情况
      if (dt.meta.status !== 201) {
        return this.$message.error(dt.meta.msg)
      }
      // 修改完成后 跳转到 商品首页
      this.$message.success(dt.meta.msg)
      this.$router.push('/goods')
    },
    pre_click(file) {
      // console.log(file)
    },
    rem_click(file, fileList) {
      // 点击删除 该图片的 时候 拿到 该图片 在数组里边的位置(索引)
      var index = this.goods_Form.pics.findIndex( (item,k)=>{
        // 删除的 图片 路径 找到在pics 数组 里边的 相等的路径 即为true 拿到 索引
        return item.pic === file.response.data.tmp_path
      })
      // 从自身 索引出发 包含自身
       this.goods_Form.pics.splice(index,1)
      // console.log(file, fileList)
    },
    succ_click(response, file, fileList) {
      const res = response.data.tmp_path
      // 每次添加 图片的 时候 向 数组 里边 添加 push 一个 对象形式 的单元
      // 属性名 是 pic 值是 临时路径
      this.goods_Form.pics.push({pic:res})
      // console.log(response, file, fileList)
    },
    // 获取级联表要用的三级数据
    async getCatList() {
      const { data: dt } = await this.$http.get('/categories', {
        params: {
          type: 3
        }
      })
      this.goods_options = dt.data
      // console.log(dt);
    },
    // 级联表的 change 事件
    goods_handleChange() {
      var len = this.goods_data_selected.length
      if (len !== 3) {
        return this.$message.error('请选择第三级别商品')
      }
      // console.log(this.goods_data_selected);
    },
    // tabs点击事件
    async tab_switch() {
      // 在没有 选择 第三级别权限的时候 该函数 会返回 提示信息
      this.goods_handleChange()
      // 拿到当前进度
      var activename = this.schedule
      // 拿到 当前 第三级别权限的 id值用来 发送 ajax 获取单独数据
      var id = this.goods_data_selected[2]
      if (activename == 1) {
        // 发送ajax 是 必须指定 该属性类型 是 动态或者  静态的
        const { data: dt } = await this.$http.get(
          `categories/${id}/attributes`,
          {
            params: {
              sel: 'many'
            }
          }
        )
        if (dt.meta.status !== 200) {
          return this.$message.error(dt.meta.msg)
        }
        // 将 拿到的 数组赋值给 data 里边的 成员共 html 部分渲染 使用
        // 遍历 data 数组 里边的 每一项 拿出来 里边的 attr_vals属性 将 这里边的 字符串按
        // ',' 分割 成为一个 数组 用来在 行内 进行v-for
        dt.data.forEach((item, index) => {
          item.attr_vals = item.attr_vals.split(',')
        })
        this.Parameter = dt.data
        // console.log(this.Parameter[0].attr_vals);

        // console.log(dt)
      }

      if (activename == 2) {
        const { data: dt } = await this.$http.get(
          `categories/${id}/attributes`,
          {
            params: {
              sel: 'only'
            }
          }
        )
        this.Static_attribute = dt.data
        // console.log(dt.data)
      }
    },
    // tabs点击切换时触发的钩子函数
    before_click(activeName, oldActiveName) {
      // 这个钩子函数 自带两个参数
      // 1.点击之后 到达的activename 值
      // 2.从哪个 activename 值 跳过来的值
      var len = this.goods_data_selected.length
      if (len !== 3) {
        // 在该函数 接收到 false 或者 promise 对象之后 则会阻止 默认跳转。
        return false
      }

      // console.log(activeName);
      // console.log(oldActiveName);
    }
  }
}
</script>

<style lang="less" scoped>
.el-card,
.el-steps {
  margin-top: 15px;
}
// .quill-editor,.ql-blank,.ql-editor  {
//   min-height: 250px;
// }
// .ql-editor,
// .ql-blank,
// .editor {
//   min-height: 200px;
// }
.editor,
.ql-blank {
  min-height: 200px;
}
// .ql-container, .ql-snow,.ql-editor,.ql-blank {
//   height: 200px;
// }
</style>
