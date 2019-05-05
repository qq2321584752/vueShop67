<template>
  <div>
    <crumb nm="数据统计" lb="数据报表"></crumb>

    <el-card>
      <!--数据表绑定的 dom 容器必须要有 足够的宽高-->
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
// npm命令 npm i echarts
// 下载完成后直接引入
import echarts from 'echarts'

export default {
  //   components: {
  //     echarts: echarts
  //   },
  //   mounted生命周期函数 第二个重要的创建阶段
  // 此时的 html模板和data，methods等数据已经渲染完成 是操作dom的最好时期
  mounted() {
    console.log(echarts)
    // 调用 方法
    this.getdata_list()
  },

  methods: {
    //   所有配置项 不知道放在 哪里的 时候 都可以放在methods里边 在mounted里边调用
    async getdata_list() {
      // console.log(echarts)
      //   echarts的init方法可以 初始化选择 一个 dom 元素来作为一个容器 返回一个实例对象
      // 该对象的 setOption 方法用来 配置选项需要的是一个 最终对象形式
      var myChart = echarts.init(document.getElementById('main'))
      //   发送ajax 拿到活数据
      const { data: dt } = await this.$http.get('/reports/type/1')
        // 拿到 后端返回的 数据 里边的数据格式 和 echarts要去的属性名称一致
        // 将 我们的数据 代替掉他原来的数据 就是 把两个对象 合并
        // ES6新语法 {...对象} 对象 展开操作
      var option2 = dt.data
        // 定义最后 表要使用的 数据 去掉原本 我们后端数据要展示的部分
      var option = {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },

        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        }
      }
    //   把我们的 后端数据 和 原本的默认数据 对象 展开方式 拿到返回的 新key value 形式的 对象
      var option1 = { ...option2, ...option }
      console.log(option1)

      // 绘制图表 给到echarts 的配置项
      myChart.setOption(option1)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
