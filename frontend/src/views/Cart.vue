<template>
  <button class="back-btn" @click="$router.go(-1)">返回</button>
  <div class="cart-page">
    <h2 style="margin-bottom: 20px; color: #9000ff;">全部商品</h2>
    
    <!-- 购物车表头 -->
    <div class="cart-header">
      <div class="col-select">全选 <input type="checkbox" v-model="selectAll" @change="handleSelectAll" /></div>
      <div class="col-goods">商品</div>
      <div class="col-price">单价</div>
      <div class="col-num">数量</div>
      <div class="col-subtotal">小计</div>
      <div class="col-op">操作</div>
    </div>

    <!-- 购物车商品列表 -->
    <div v-if="list.length > 0">
      <div class="cart-item-row" v-for="item in list" :key="item.id">
        <div class="col-select">
          <input type="checkbox" v-model="item.checked" @change="calcTotal" />
        </div>
        <div class="col-goods">
          <img 
            :src="`https://picsum.photos/300/300?random=${item.goods_id}`" 
            class="goods-img" 
            alt=""
          />
          <div class="goods-name">{{ item.goods_name }}</div>
        </div>
        <div class="col-price">¥{{ item.price }}</div>
        <div class="col-num">
          <div class="num-adjust">
            <button class="num-btn" @click="changeNum(item, -1)">-</button>
            <input 
              type="number" 
              v-model="item.num" 
              class="num-input" 
              min="1" 
              @change="calcTotal"
            />
            <button class="num-btn" @click="changeNum(item, 1)">+</button>
          </div>
        </div>
        <div class="col-subtotal">¥{{ (item.price * item.num).toFixed(2) }}</div>
        <div class="col-op">
          <button class="del-btn" @click="delItem(item.id)">删除</button>
        </div>
      </div>

      <!-- 购物车底部操作栏 -->
      <div class="cart-footer">
        <div class="cart-footer-left">
          <div>全选 <input type="checkbox" v-model="selectAll" @change="handleSelectAll" /></div>
          <button @click="delSelected">删除选中的商品</button>
          <button @click="clearCart">清理购物车</button>
        </div>
        <div class="cart-footer-right">
          <div class="total-info">
            已选 {{ selectedCount }} 件商品 总价：
            <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn" @click="$router.push('/checkout')">去结算</button>
        </div>
      </div>
    </div>

    <!-- 空购物车提示 -->
    <div v-else class="empty-cart">
      您的购物车为空~
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = ref([]) // 购物车列表
const selectAll = ref(false) // 全选状态
const totalPrice = ref(0) // 选中商品总价
const selectedCount = ref(0) // 选中商品数量

// 加载购物车数据
onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    axios.get(`http://localhost:3000/api/cart/${user.id}`).then(res => {
      // 给每个商品添加选中状态
      list.value = res.data.map(item => ({ ...item, checked: true }))
      calcTotal() // 初始化计算总价
    })
  } else {
    router.push('/login')
  }
})

// 监听全选状态变化
watch(selectAll, (newVal) => {
  list.value.forEach(item => {
    item.checked = newVal
  })
  calcTotal()
})

// 全选/取消全选
const handleSelectAll = () => {
  list.value.forEach(item => {
    item.checked = selectAll.value
  })
  calcTotal()
}

// 调整商品数量
const changeNum = (item, num) => {
  const newNum = item.num + num
  if (newNum < 1) return // 数量不能小于1
  item.num = newNum
  calcTotal()
  // 同步更新数据库
  // axios.post('/api/cart/update', { id: item.id, num: item.num })
}

// 删除单个商品
const delItem = (id) => {
  const user = JSON.parse(localStorage.getItem('user'))
  // 前端删除
  list.value = list.value.filter(item => item.id !== id)
  // 后端删除
  axios.post('http://localhost:3000/api/cart/delete', { id, userId: user.id })
  calcTotal()
}

// 删除选中商品
const delSelected = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const selectedIds = list.value.filter(item => item.checked).map(item => item.id)
  if (selectedIds.length === 0) return alert('请选择要删除的商品')
  
  // 前端删除
  list.value = list.value.filter(item => !item.checked)
  // 后端批量删除
  selectedIds.forEach(id => {
    axios.post('http://localhost:3000/api/cart/delete', { id, userId: user.id })
  })
  calcTotal()
}

// 清空购物车
const clearCart = () => {
  if (!confirm('确定清空购物车吗？')) return
  const user = JSON.parse(localStorage.getItem('user'))
  // 前端清空
  list.value = []
  // 后端清空
  axios.post('http://localhost:3000/api/cart/clear', { userId: user.id })
  calcTotal()
}

// 计算选中商品总价和数量
const calcTotal = () => {
  let total = 0
  let count = 0
  list.value.forEach(item => {
    if (item.checked) {
      total += item.price * item.num
      count += 1
    }
  })
  totalPrice.value = total
  selectedCount.value = count
  // 更新全选状态
  selectAll.value = list.value.length > 0 && list.value.every(item => item.checked)
}
</script>