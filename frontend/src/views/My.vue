<template>
  <button class="back-btn" @click="$router.go(-1)">返回</button>
  <div class="page" style="text-align:center;padding-top:50px;">
    <div style="font-size:50px;">👤</div>
    <h3>{{ user.nickname }}</h3>
    <p>账号：{{ user.username }}</p>
    <button class="btn" @click="logout" style="margin-top:30px;">退出登录</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const user = ref({})
onMounted(() => {
  user.value = JSON.parse(localStorage.getItem('user'))
})
const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>