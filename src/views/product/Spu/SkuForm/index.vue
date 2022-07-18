<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
      <el-input placeholder="Sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
      <el-input type="textarea" rows="4" placeholder="规格描述" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="attr.attrName" v-for="attr in attrInfoList" :key="attr.id">
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`" v-for="attrValue in attr.attrValueList" :key="attrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in spuSaleAttrList" :key="saleAttr.id">
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table style="width: 100%" border :data="spuImageList" @selection-change="handleSelectChange">
          <el-table-column prop="prop" width="80px" type="selection"></el-table-column>
          <el-table-column prop="tupian " label="图片" width="width">
            <template slot-scope="{row}">
              <img :src="row.imgUrl" style="width:100px;height:100px">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width"></el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="changeDefualt(row)">设置默认</el-button>
              <el-button size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'SkuForm',
    data(){
      return{
        spuImageList:[],
        spuSaleAttrList:[],
        attrInfoList:[],
        //收集sku数据
        skuInfo: {
          //第一类收集的数据：父组件给的数据
          category3Id: 0,
          spuId: 0,
          tmId: 0,
          //第二类：需要通过数据双向绑定v-model收集
          skuName: "",
          price: 0,
          weight: "",
          skuDesc: "",
          //第三类：需要自己书写代码
          //默认图片
          skuDefaultImg: "",
          //收集图片的字段
          skuImageList: [
            // {
            //   id: 0,
            //   imgName: "string",
            //   imgUrl: "string",
            //   isDefault: "string",
            //   skuId: 0,
            //   spuImgId: 0,
            // },
          ],
          //平台属性
          skuAttrValueList: [
            // {
            //   attrId: 0,
            //   valueId: 0,
            // },
          ],
          //销售属性
          skuSaleAttrValueList: [
            // {
            //   id: 0,
            //   saleAttrId: 0,
            //   saleAttrName: "string",
            //   saleAttrValueId: 0,
            //   saleAttrValueName: "string",
            //   skuId: 0,
            //   spuId: 0,
            // },
          ],
        },
        spu:{},
        imageList:[],
      }
    },
    methods:{
      //获取skuForm数据
      async getData(category1Id,category2Id,spu){
        //收集父组件给的数据
        this.skuInfo.category3Id = spu.category3Id
        this.skuInfo.spuId = spu.id
        this.skuInfo.tmId = spu.tmId
        this.spu = spu
        let resultImage = await this.$API.sku.reqSpuImageList(spu.id)
        if(resultImage.code == 200){
          let list = resultImage.data
          list.forEach(item=>{
            item.isDefault = 0
          })
          this.spuImageList = list
        }
        let resultSale = await this.$API.sku.reqSpuSaleAttrList(spu.id)
        if(resultSale.code == 200){
          this.spuSaleAttrList = resultSale.data
        }
        let resultInfo = await this.$API.sku.reqAttrInfoList(category1Id,category2Id,spu.category3Id)
        if(resultInfo.code == 200){
          this.attrInfoList = resultInfo.data
        }
      },
      //table复选框
      handleSelectChange(selection){
        this.imageList = selection
      },
      changeDefualt(row){
        this.spuImageList.forEach(item=>{
          item.isDefault = 0
        })
        row.isDefault = 1
        this.skuInfo.skuDefaultImg = row.imgUrl
      },
      cancel(){
        this.$emit('changeScenes',0)
        Object.assign(this._data,this.$options.data())
      },
      async save(){
        const {attrInfoList,skuInfo,spuSaleAttrList,imageList} = this
        skuInfo.skuAttrValueList = attrInfoList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
            const [attrId,valueId] = item.attrIdAndValueId.split(':')
            prev.push({attrId,valueId})
          }
          return prev
        },[])
        skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
          if(item.attrIdAndValueId){
            const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(':')
            prev.push({saleAttrId,saleAttrValueId})
          }
          return prev
        },[])
        skuInfo.skuImageList = imageList.map(item=>{
          return{
            imgName:item.imgName,
            imgUrl:item.imgUrl,
            isDefault:item.isDefault,
            spuImgId:item.id
          }
        })
        let result = await this.$API.sku.reqAddSku(skuInfo)
        if(result.code == 200){
          this.$message({type:'success',message:'添加Sku成功'})
          this.$emit('changeScenes',0)
        }
      }
    }
}
</script>

<style>

</style>