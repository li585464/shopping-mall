<template>
  <div class="container">
    <div class="global-nav">
      <div class="logo">电商商城</div>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/cart">购物车</router-link>
        <router-link to="/my">我的</router-link>
        <router-link to="/login">登录/注册</router-link>
      </div>
    </div>

    <!--路由页面-->
    <router-view />
    <div class="nav" style="display: none;"></div>
  </div>
</template>

<script setup>
</script>