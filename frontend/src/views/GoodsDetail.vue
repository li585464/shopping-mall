<template>
  <button class="back-btn" @click="$router.go(-1)">返回</button>
  <div class="page">
    <img :src="good.image" style="width:100%;height:250px;object-fit:cover" />
    <h2>{{ good.name || good.title }}</h2> <!-- 兼容starGoods的title字段 -->
    <p style="margin:10px 0;">¥{{ good.price }}</p>
    <p>{{ good.intro || '明星单品精选好物' }}</p> <!-- 兼容无intro的情况 -->
    <div style="display:flex;justify-content:center;margin-top:30px;">
      <button class="btn orange" @click="openModal(1)" :disabled="loading">立即购买</button>
      <button class="btn" @click="openModal(2)" :disabled="loading">加入购物车</button>
    </div>

    <div class="modal" v-if="showModal">
      <div class="modal-box">
        <h3>选择规格</h3>
        <!--规格选择项-->
        <div class="form-item">
          <label>规格：</label>
          <select v-model="spec">
            <option>标准版</option>
            <option>升级版</option>
            <option>豪华版</option>
          </select>
        </div>
        <div class="form-item">
          <label>颜色：</label>
          <select v-model="color">
            <option>白色</option>
            <option>黑色</option>
            <option>蓝色</option>
          </select>
        </div>
        <div class="form-item">
          <label>数量：</label>
          <input type="number" v-model="num" min="1" value="1" />
        </div>
        <button class="btn" @click="confirm" :disabled="loading">
          {{ loading ? '处理中...' : '确定' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 商品信息
const good = ref({})
// 弹窗与选择项
const showModal = ref(false)
const type = ref(0) // 1=立即购买 2=加入购物车
const color = ref('白色')
const num = ref(1)
const spec = ref('标准版') //规格变量
// 加载状态
const loading = ref(false)

// 页面挂载时获取商品详情（兼容明星单品和普通商品）
onMounted(async () => {
  try {
    // 先尝试获取普通商品
    let res = await axios.get('http://localhost:3000/api/goods')
    let targetGood = res.data.find(i => i.id == route.params.id)

    // 如果没找到，尝试获取明星单品
    if (!targetGood) {
      // 方式1：前端匹配明星单品（临时方案）
      const starGoods = [
        { title: "Apple iPhone SE 16GB", image: "https://picsum.photos/200/120?random=1", price: 249, id: 101 },
        { title: "Apple iPad Pro 9.7英寸", image: "https://picsum.photos/200/120?random=2", price: 229, id: 102 },
        { title: "Apple Watch 尼龙表带", image: "https://picsum.photos/200/120?random=3", price: 140, id: 103 },
        { title: "OPPO R9全网通", image: "https://picsum.photos/200/120?random=4", price: 146, id: 104 },
        { title: '轮播图特惠商品', image: 'https://picsum.photos/200/120?random=10', price: 199, id: 9999 }
      ]
      targetGood = starGoods.find(i => i.id == route.params.id)
      
      // 方式2：后端提供明星单品接口（推荐）
      // res = await axios.get(`http://localhost:3000/api/goods/star/${route.params.id}`)
      // targetGood = res.data
    }

    if (targetGood) {
      good.value = targetGood
    } else {
      alert('商品不存在！')
      router.push('/')
    }
  } catch (err) {
    console.error('获取商品详情失败：', err)
    alert('加载商品信息失败，请重试！')
  }
})

// 打开规格选择弹窗
const openModal = t => {
  showModal.value = true
  type.value = t
}

// 确认选择
const confirm = async () => {
  // 校验用户是否登录
  const userStr = localStorage.getItem('user')
  if (!userStr) {
    alert('请先登录！')
    return router.push('/login')
  }
  const user = JSON.parse(userStr)

  // 校验商品数量
  if (num.value < 1) {
    alert('购买数量不能小于1！')
    return
  }

  // 构造请求数据（兼容title/name字段）
  const requestData = {
    user_id: user.id,
    goods_id: good.value.id,
    goods_name: good.value.name || good.value.title, // 兼容字段
    price: good.value.price,
    spec: spec.value,
    color: color.value,
    num: num.value,
    goods_image: good.value.image,
    unit_price: good.value.price
  }

  try {
    loading.value = true
    // 发送请求到购物车接口
    await axios.post('http://localhost:3000/api/cart/add', requestData)
    
    // 处理请求成功逻辑
    showModal.value = false
    if (type.value === 1) {
      // 立即购买：跳转到结算页
      router.push('/checkout')
    } else {
      // 加入购物车：提示成功 + 跳转到购物车
      alert('加入购物车成功！')
      router.push('/cart')
    }
  } catch (err) {
    // 错误处理
    console.error('操作失败：', err)
    alert(err.response?.data?.msg || '操作失败，请重试！')
  } finally {
    loading.value = false
  }
}
</script>