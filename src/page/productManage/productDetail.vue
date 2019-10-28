<template>
  <div id="productDetail">
    <div class="product-info-content">
      <span>商品名称：</span>
      <span>{{productInfo.name}}</span>
    </div>
    <div class="product-info-content">
      <span>商品型号：</span>
      <span>{{productInfo.model}}</span>
    </div>
    <div class="product-info-content">
      <span>商品图片：</span>
      <img :src="productInfo.goodsImg" alt="商品图片" class="productImg">
    </div>
    <div class="product-info-content">
      <span>商品原价：</span>
      <span>{{productInfo.originPrice}}</span>
    </div>
    <div class="product-info-content">
      <span>商品现价：</span>
      <span>{{productInfo.currentPrice}}</span>
    </div>
    <div class="product-info-content">
      <span>库存：</span>
      <span>{{productInfo.stock}}</span>
    </div>
    <div class="product-info-content">
      <span>商品状态：</span>
      <span>{{productInfo.status=='NORMAL'?'正常':productInfo.status=='NO_STOCK'?'无库存':productInfo.status=='REMOVE'?'下架':''}}</span>
    </div>
    <div class="product-info-content">
      <span>销售佣金：</span>
      <span>{{productInfo.profit.upper1LevelProfit}}</span>
    </div>
    <div class="product-info-content">
      <span>管理佣金：</span>
      <span>{{productInfo.profit.upper2LevelProfit}}</span>
    </div>
    <div class="product-info-content">
      <span>门店佣金：</span>
      <span>{{productInfo.profit.stationEarning}}</span>
    </div>
    <div class="product-info-content">
      <span>技工佣金：</span>
      <span>{{productInfo.profit.techEarning}}</span>
    </div>
    <div class="product-info-content">
      <span>商品轮播图：</span>
      <div>
        <img
          v-for="item in productInfo.swiperImgs"
          :key="item.id"
          :src="item.url"
          alt
          class="productImg"
        >
      </div>
    </div>
    <div class="product-info-content">
      <span>商品详情图：</span>
      <div  style="flex:1">
        <img
          v-for="item in productInfo.detailImgs"
          :key="item.id"
          :src="item.url"
          alt
          class="productImg"
        >
      </div>

    </div>
    <div style="text-align: center;margin-top: 12px;">
      <el-button type="primary" @click="$router.go(-1)"  size="medium">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: `productDetail`,
  data() {
    return {
      productInfo: {}
    };
  },
  activated() {
    this.productInfo = JSON.parse(this.$route.query.productInfo);
  }
};
</script>
<style lang="stylus" scoped>
.product-info-content {
  line-height: 36px;
  display: flex;
  align-items: center;
}

.product-info-content>span {
  display: block;
  margin-right: 14px;
}

.product-info-content>span:nth-child(1) {
  width: 120px;
}

.productImg {
  width: 178px;
  height: 178px;
  margin-right: 12px;
}
</style>