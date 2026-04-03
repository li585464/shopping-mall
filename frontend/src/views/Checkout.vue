<template>
  <button class="back-btn" @click="$router.go(-1)">返回</button>
  <div class="page">
    <h3>结算信息</h3>
    <div class="form-item">
      <input placeholder="收货人姓名" v-model="name" />
    </div>
    <div class="form-item">
      <input placeholder="手机号码" v-model="phone" />
    </div>
    <div class="form-item">
      <input placeholder="详细地址" v-model="addr" />
    </div>
    <div style="text-align:right;margin-top:30px;">
      <button class="btn" @click="pay">提交结算</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
const router = useRouter()

const name = ref('')
const phone = ref('')
const addr = ref('')

// 提交结算
const pay = async () => {
  // 校验必填信息
  if (!name.value || !phone.value || !addr.value) {
    alert('请填写完整的收货信息！')
    return
  }

  // 获取登录用户
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.id) {
    alert('请先登录！')
    router.push('/login')
    return
  }

  try {
    // 后端清空购物车（模拟支付成功）
    await axios.post('http://localhost:3000/api/cart/clear', {
      userId: user.id
    })

    alert('提交订单成功！感谢购买')
    router.push('/') // 跳回首页
  } catch (err) {
    console.error('结算失败：', err)
    alert('结算失败，请重试')
  }
}
</script>