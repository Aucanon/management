<template>
  <div>
    <el-form ref="form" label-width="80px" :model="spu">
        <el-form-item label="Spu名称">
            <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
        </el-form-item>
        <el-form-item label="品牌">
            <el-select  placeholder="请选择品牌" v-model="spu.tmId">
                <el-option :label="tm.tmName" :value="tm.id" v-for="tm in tradeMarkList" :key="tm.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" rows="4" placeholder="描述" v-model="spu.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :file-list="spuImageList" :on-success="handlerSuccess">
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-select :placeholder="`还有${unSelectSaleAttr.length}未选择`" v-model="attrIdAndAttrName">
                <el-option :label="unselect.name" :value="`${unselect.id}:${unselect.name}`" v-for="unselect in unSelectSaleAttr" :key="unselect.id"></el-option>
            </el-select>
            <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
            <el-table border style="width: 100%" :data="spu.spuSaleAttrList">
                <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
                <el-table-column prop="saleAttrName" label="属性名" width="width"></el-table-column>
                <el-table-column prop="prop" label="属性值名称列表" width="width">
                    <template slot-scope="{row}">
                        <el-tag :key="tag.id" v-for="(tag,index) in row.spuSaleAttrValueList" closable :disable-transitions="false" @close="row.spuSaleAttrValueList.splice(index,1)">{{tag.saleAttrValueName}}</el-tag>
                        <el-input class="input-new-tag" v-if="row.inputVisible" v-model="row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)" @blur="handleInputConfirm(row)"></el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="addSaleAttrValue(row)">添加</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="prop" label="操作" width="width">
                    <template slot-scope="{$index}">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'SpuForm',
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        spu:{
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },//存储spu信息属性
        tradeMarkList:[],//存储品牌信息
        spuImageList:[],//存储spu图片
        saleAttrList:[],//销售属性
        attrIdAndAttrName:'',//收集未选择销售属性id
      }
    },
    methods: {
        //照片墙删除图片
      handleRemove(file, fileList) {
        this.spuImageList = fileList
      },
      //照片墙图片预览函数
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },
      async initSpuData(spu){
        //获取SPU信息
        let spuResult = await this.$API.spu.reqSpu(spu.id)
        if(spuResult.code == 200){
            this.spu = spuResult.data
        }
        //获取品牌信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200){
            this.tradeMarkList = tradeMarkResult.data
        }
        let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
        if(spuImageResult.code == 200){
            let listArr = spuImageResult.data
            listArr.forEach(item=>{
                item.name = item.imgName
                item.url = item.imgUrl
            })
            this.spuImageList = listArr
        }
        //获取平台销售属性
        let spuSaleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(spuSaleResult.code == 200){
            this.saleAttrList = spuSaleResult.data
        }
      },
      //照片墙图片上传成功
      handlerSuccess(response,file,fileList){
        this.spuImageList = fileList
      },
      //添加新的销售属性
      addSaleAttr(){
        const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
        let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
        this.spu.spuSaleAttrList.push(newSaleAttr)
        this.attrIdAndAttrName = ''
      },
      //添加按钮
      addSaleAttrValue(row){
        this.$set(row,'inputVisible',true)
        this.$set(row,'inputValue','')
      },
      handleInputConfirm(row){
        const {baseSaleAttrId,inputValue} = row
        if(inputValue.trim() == ''){
            this.$message('属性值不能为空！')
            return
        }
        let result = row.spuSaleAttrValueList.some(item=>item.saleAttrValueName == inputValue)
        if(result){
            this.$message('该属性已存在！')
            return
        }
        let newSaleAttrValue = {baseSaleAttrId:parseInt(baseSaleAttrId),saleAttrValueName:inputValue}
        // console.log(newSaleAttrValue);
        row.spuSaleAttrValueList.push(newSaleAttrValue)
        row.inputVisible = false
        // console.log(row);
      },
      async addOrUpdateSpu(){
        this.spu.spuImageList = this.spuImageList.map(item=>{
            return{
                imgName:item.name,
                imgUrl:(item.response && item.response.data) || item.url
            }
        })
        let result =  await this.$API.spu.reqUpdateOrAddSpu(this.spu)
        if(result.code == 200){
            this.$message({type:'success',message:'保存成功！'})
            //通知父组件返回场景0
            this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
        }
        //清除数据
        Object.assign(this._data,this.$options.data())
      },
      //添加SPU
      async addSpuData(category3Id){
        this.spu.category3Id = category3Id
        //获取品牌信息
        let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
        if(tradeMarkResult.code == 200){
            this.tradeMarkList = tradeMarkResult.data
        }
        //获取平台销售属性
        let spuSaleResult = await this.$API.spu.reqBaseSaleAttrList()
        if(spuSaleResult.code == 200){
            this.saleAttrList = spuSaleResult.data
        }
      },
      //取消按键
      cancel(){
        this.$emit('changeScene',{scene:0,flag:''})
        //清除数据
        Object.assign(this._data,this.$options.data())
      }
    },
    computed:{
        unSelectSaleAttr(){
            let result = this.saleAttrList.filter(item=>{
                return this.spu.spuSaleAttrList.every(item1=>{
                    return item.name != item1.saleAttrName
                })
            })
            return result
        }
    }
}
</script>

<style>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>