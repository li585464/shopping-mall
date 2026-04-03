<template>
  <button class="back-btn" @click="$router.go(-1)">返回</button>
  <div class="login-page">
    <div class="form-card">
      <!-- 登录 -->
      <div v-if="!isRegister">
        <h2 class="form-title">用户登录</h2>
        
        <div class="form-item">
          <label>用户名</label>
          <input v-model="form.username" placeholder="请输入用户名" />
        </div>
        
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="form.password" placeholder="请输入密码" />
        </div>

        <button class="form-btn btn-purple" @click="login">登录</button>
        
        <p class="switch-text">
          没有账号？<span @click="isRegister=true">立即注册</span>
        </p>
      </div>

      <!-- 注册 -->
      <div v-else>
        <h2 class="form-title">用户注册</h2>
        
        <div class="form-item">
          <label>用户名</label>
          <input v-model="form.username" placeholder="请输入用户名" />
        </div>
        
        <div class="form-item">
          <label>密码</label>
          <input type="password" v-model="form.password" placeholder="请输入密码" />
        </div>
        
        <div class="form-item">
          <label>昵称</label>
          <input v-model="form.nickname" placeholder="请输入昵称" />
        </div>
        
        <div class="form-item">
          <label>手机号</label>
          <input v-model="form.phone" placeholder="请输入手机号" />
        </div>

        <button class="form-btn btn-purple" @click="register">注册</button>
        
        <p class="switch-text">
          已有账号？<span @click="isRegister=false">立即登录</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()

const isRegister = ref(false)
const form = ref({
  username: '',
  password: '',
  nickname: '',
  phone: ''
})

// 登录
const login = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/login', {
      username: form.value.username,
      password: form.value.password
    })
    if (res.data.code === 200) {
      localStorage.setItem('user', JSON.stringify(res.data.user))
      alert('登录成功')
      router.push('/')
    } else {
      alert(res.data.msg)
    }
  } catch (e) {
    alert('登录失败')
  }
}

// 注册
const register = async () => {
  try {
    const res = await axios.post('http://localhost:3000/api/register', form.value)
    alert(res.data.msg)
    if (res.data.code === 200) {
      isRegister.value = false
    }
  } catch (e) {
    alert('注册失败')
  }
}
</script>