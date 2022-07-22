<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" align="center" width="80"></el-table-column>
      <el-table-column prop="skuName" label="名称" width="width"></el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width"></el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{row}">
          <img :src="row.skuDefaultImg" style="width:80px;height:80px">
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{row}">
          <hint-button type="success" title="上架" icon="el-icon-top" size="mini" v-if="row.isSale==0" @click="sale(row)"></hint-button>
          <hint-button type="success" title="下架" icon="el-icon-bottom" size="mini" v-else @click="cancel(row)"></hint-button>
          <hint-button type="primary" title="编辑" icon="el-icon-edit" size="mini" @click="edit"></hint-button>
          <hint-button type="info" title="详情" icon="el-icon-info" size="mini" @click="getSkuInfo(row)"></hint-button>
          <el-popconfirm title="确认删除?" @onConfirm="deleteSku(row)">
                <hint-button type="danger" icon="el-icon-delete" size="mini" title="删除Sku" slot="reference"></hint-button>
              </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination style="text-align:center"    
      @size-change="handleSizeChange"
      @current-change="getSkuProduct"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper ,->,sizes,total"
      :total="total">
    </el-pagination>

    <el-drawer :visible.sync="show" :show-close="false" size="50%">
      <el-row>
      <el-col :span="5">名称</el-col>
      <el-col :span="16">{{skuInfo.skuName}}</el-col>
    </el-row>
      <el-row>
      <el-col :span="5">描述</el-col>
      <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
    </el-row>
      <el-row>
      <el-col :span="5">价格</el-col>
      <el-col :span="16">{{skuInfo.price}}元</el-col>
    </el-row>
      <el-row>
      <el-col :span="5">平台属性</el-col>
      <el-col :span="16">
        <el-tag type="success" v-for="attr in skuInfo.skuAttrValueList" :key="attr.id" style="margin-right:10px">{{attr.attrId}}-{{attr.valueId}}</el-tag>
      </el-col>
    </el-row>
      <el-row>
      <el-col :span="5">商品图片</el-col>
      <el-col :span="16">
        <el-carousel height="450px">
          <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item">
            <img :src="item.imgUrl" style="width:100%;height:100%">
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
    </el-drawer>

  </div>
</template>

<script>
export default {
    name:'Sku',
    data(){
      return{
        page:1,
        limit:10,
        records:[],//存储Sku列表数据
        total:0,
        skuInfo:{},//存储Sku信息
        show:false,
      }
    },
    mounted(){
      //获取product方法
      this.getSkuProduct()
    },
    methods:{
      //获取skuproduct数据
      async getSkuProduct(pages = 1){
        this.page = pages
        const {page,limit} = this
        let result = await this.$API.sku.reqProductList(page,limit)
        if(result.code == 200){
          this.total = result.data.total
          this.records = result.data.records
        }
      },
      handleSizeChange(limit){
        this.limit = limit
        this.getSkuProduct()
      },
      async sale(row){
        let result = await this.$API.sku.reqOnSale(row.id)
        if(result.code == 200){
          this.$message({type:'success',message:'上架成功！'})
          row.isSale = 1
        }
      },
      async cancel(row){
        let result = await this.$API.sku.reqCancelSale(row.id)
        if(result.code == 200){
          this.$message({type:'success',message:'下架成功！'})
          row.isSale = 0
        }
      },
      edit(){
        this.$message('正在开发中！')
      },
      async getSkuInfo(sku){
        this.show = true
        let result = await this.$API.sku.reqSkuById(sku.id)
        if(result.code == 200){
          this.skuInfo = result.data
        }
      },
      async deleteSku(sku){
        let result = await this.$API.sku.reqDelete(sku.id)
        if(result.code == 200){
          this.$message({type:'success',message:'删除成功！'})
          this.getSkuProduct()
        }
      }
    }
}
</script>

<style scoped>
  .el-row .el-col-5{
    font-size: 18px;
    text-align: right;
  }

  .el-col{
    margin:10px;
  }

  .el-carousel__button{
    width: 10px;
    height: 10px;
    background-color: rgb(121, 107, 107);
    border-radius: 50%;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
</style>