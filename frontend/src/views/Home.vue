<template>
  <button class="back-btn" @click="goBack">返回</button>
  <!--Logo + 搜索栏-->
  <div class="header">
    <div class="logo"><span>http://localhost:5173/</span></div>
    <div class="search-box">
      <input type="text" placeholder="搜索需要的商品" />
      <button class="search-btn">搜索</button>
    </div>
    <div class="hotline">vx:19172595946</div>
  </div>

  <!-- 主导航+分类+轮播 -->
  <div class="main-nav-area">
    <div class="cate-list">
      <div class="cate-item">手机通讯</div>
      <div class="cate-item">电脑平板</div>
      <div class="cate-item">摄影摄像</div>
      <div class="cate-item">数码产品</div>
      <div class="cate-item">美妆健康</div>
      <div class="cate-item">日用</div>
      <div class="cate-item">运动户外</div>
      <div class="cate-item">奢侈品</div>
      <div class="cate-item">礼品</div>
    </div>
    <div class="banner-area">
      <div class="swiper">
        <div class="swiper-text">
          <h2>开学季 让美好即刻发生</h2>
          <p>小米5 现货发售 | 阿迪耐克鞋99元限量抢</p>
          <button class="swiper-btn" @click="openBannerBuy">立即抢购</button>
        </div>
      </div>
    </div>
  </div>

  <!--功能图标栏-->
  <div class="func-bar">
    <div class="func-item">
      <div class="func-icon">⚡</div>
      <div>极速分期</div>
    </div>
    <div class="func-item">
      <div class="func-icon">✅</div>
      <div>线上认证</div>
    </div>
    <div class="func-item">
      <div class="func-icon">🏆</div>
      <div>卓越品质</div>
    </div>
    <div class="func-item">
      <div class="func-icon">💳</div>
      <div>轻松还款</div>
    </div>
    <div class="func-item">
      <div class="func-icon">🛒</div>
      <div>线上购买</div>
    </div>
  </div>

  <!--明星单品 → 点击跳转到商品详情页（和新人特惠一致）-->
  <div class="star-goods">
    <div class="star-title">购物商城明星单品</div>
    <div class="star-grid">
      <div 
        class="star-item" 
        v-for="(item, idx) in starGoods" 
        :key="idx"
        @click="$router.push(`/detail/${item.id}`)"
        style="cursor:pointer"
      >
        <p>{{ item.title }}</p>
        <img :src="item.image" alt="" />
        <div class="star-price">¥{{ item.price }} x24期</div>
      </div>
    </div>
  </div>

  <!--新人特惠商品列表-->
  <div class="goods-area">
    <div class="goods-title">新人特惠（组团三折）</div>
    <div class="goods-list">
      <div class="goods-item" v-for="item in goods" :key="item.id" @click="$router.push(`/detail/${item.id}`)">
        <img :src="item.image" alt="" />
        <div class="goods-info">
          <div class="goods-name">{{ item.name }}</div>
          <div class="price-area">
            <div class="price">¥{{ item.price }}</div>
            <div class="month-price">月供 ¥{{ (item.price/12).toFixed(2) }} x12期</div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()

// 商品列表
const goods = ref([])
const starGoods = ref([
  { title: "Apple iPhone SE 16GB", image: "https://img13.360buyimg.com/n1/s450x450_jfs/t1/110746/32/4223/66870/5e99337fEf384512c/139b92cb865f0b4a.jpg", price: 249, id: 101 },
  { title: "Apple iPad Pro 9.7英寸", image: "https://img.pconline.com.cn/images/product/6145/614547/1.jpg", price: 229, id: 102 },
  { title: "Apple Watch 尼龙表带", image: "https://cbu01.alicdn.com/img/ibank/O1CN01IgAU7324u9TwqGtcc_!!2200575517450-0-cib.jpg?__r__=1667369645855", price: 140, id: 103 },
  { title: "OPPO R9全网通", image: "https://ts1.tc.mm.bing.net/th/id/R-C.081a14ff56db525ecadb397342b6e9ee?rik=4UXYfRvdM02byg&riu=http%3a%2f%2fimg12.360buyimg.com%2fcms%2fjfs%2ft2800%2f183%2f1839330153%2f63574%2f796d0c7c%2f574d5a74N85004fb5.jpg&ehk=DtCUBGODN2TtHAGGxIl2qwUL2iYOZ6WvXPnYNH38MYk%3d&risl=&pid=ImgRaw&r=0", price: 146, id: 104 }
])

// ====================== 轮播图立即抢购 ======================
const openBannerBuy = () => {
  const isLogin = checkLogin()
  if (isLogin) {
    // 轮播图商品跳转到模拟详情页
    router.push(`/detail/9999`)
  }
}

// ====================== 检查登录 ======================
const checkLogin = () => {
  const user = localStorage.getItem('user')
  if (!user) {
    alert('请先登录！')
    router.push('/login')
    return false
  }
  return true
}
const goBack = () => {
  // 首页没有上一页，提示用户
  if (window.history.length <= 1) {
    alert('当前已是首页，无法返回~')
  } else {
    router.go(-1)
  }
}

// 加载商品
onMounted(() => {
  // 加载新人特惠商品
  axios.get('http://localhost:3000/api/goods').then(res => {
    goods.value = res.data
  })

  // 可选：把明星单品数据同步到后端，方便详情页获取
  // axios.post('http://localhost:3000/api/goods/addStar', starGoods.value)
})
</script>

<style>
/* 按钮组样式 */
.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}
.btn-group .btn {
  flex: 1;
}
.btn.buy {
  background: #ff3c00;
}
</style>