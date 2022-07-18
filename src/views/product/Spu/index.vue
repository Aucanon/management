<template>
  <div>
    <el-card style="margin:20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"/>
    </el-card>
    <el-card>
      <div v-show="scene==0">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加SPU</el-button>
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width"></el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <hint-button type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)"></hint-button>
              <hint-button type="warning" icon="el-icon-edit" size="mini" title="修改Spu" @click="updateSpu(row)"></hint-button>
              <hint-button type="info" icon="el-icon-info" size="mini" title="查看当前Spu全部Sku列表" @click="handler(row)"></hint-button>
              <el-popconfirm title="确认删除?" @onConfirm="deleteSpu(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除Spu" slot="reference"></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
        style="text-align:center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper ,->, sizes,total"
          :total="total">
        </el-pagination>
      </div>
      <SpuForm v-show="scene==1" @changeScene='changeScene' ref="spu"/>
      <SkuForm v-show="scene==2" @changeScenes='changeScenes' ref="sku"/>
    </el-card>
    <el-dialog :title="`${spu.spuName}的列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" style="width:100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
        <el-table-column prop="price" label="价格" width="width"></el-table-column>
        <el-table-column prop="weight" label="重量" width="width"></el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{row}">
            <img :src="row.skuDefaultImg" style="width:100px;height:100px">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from './SkuForm'
import SpuForm from './SpuForm'


export default {
    name:'Spu',
    data(){
      return{
        category1Id:'',
        category2Id:'',
        category3Id:'',
        page:1,//分页器当前页
        limit:3,//每页多少条数据
        records:[],//spu列表数据
        total:0,//分页器一共需要展示数据的条数
        scene:0,
        dialogTableVisible: false,//对话框
        spu:{},
        skuList:[],
        loading:true,
      }
    },
    components:{
      SpuForm,
      SkuForm
    },
    methods:{
      getCategoryId({ categoryId, level }) {
        if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      }else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      }else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
      },
      async getSpuList(pages = 1){
        this.page = pages
        const {page,limit,category3Id} = this
        let result = await this.$API.spu.reqSpuList(page, limit, category3Id)
        if(result.code == 200){
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      handleSizeChange(limit){
        this.limit = limit
        this.getSpuList()
      },
      addSpu(){
        this.scene = 1
        this.$refs.spu.addSpuData(this.category3Id)
      },
      updateSpu(row){
        this.scene = 1
        //获取调用子组件方法
        this.$refs.spu.initSpuData(row)
      },
      changeScene({scene,flag}){
        this.scene = scene
        if(flag == '修改'){
          this.getSpuList(this.page)
        }else{
          this.getSpuList()
        }
      },
      changeScenes(scene){
        this.scene = scene
      },
      async deleteSpu(row){
        let result = await this.$API.spu.reqDeleteSpu(row.id)
        if(result.code == 200){
          this.$message('删除成功！')
          this.getSpuList(this.records.length>1?this.page:this.page-1)
        }
      },
      addSku(row){
        this.scene = 2
        //父组件调用子组件方法发送请求
        this.$refs.sku.getData(this.category1Id,this.category2Id,row)
      },
      async handler(spu){
        this.dialogTableVisible = true
        this.spu = spu
        let result = await this.$API.sku.reqSkuList(spu.id)
        if(result.code == 200){
          this.skuList = result.data
          this.loading = false
        }
      },
      close(done){
        this.loading = true
        this.skuList = []
        done()
      }
    },
}
</script>

<style>

</style>