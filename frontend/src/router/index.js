import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import My from '../views/My.vue'
import Login from '../views/Login.vue'
import GoodsDetail from '../views/GoodsDetail.vue'
import Checkout from '../views/Checkout.vue'
import Cart from '../views/Cart.vue'

// 登录守卫：验证是否登录
const requireAuth = (to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (user) {
    next()
  } else {
    next('/login')
  }
}

// 路由数组
const routes = [
  { path: '/', component: Home },
  { path: '/my', component: My, beforeEnter: requireAuth }, // 已加守卫，无需全局重复校验
  { path: '/login', component: Login },
  { path: '/detail/:id', component: GoodsDetail },
  { path: '/checkout', component: Checkout, beforeEnter: requireAuth },
  { path: '/cart', component: Cart, beforeEnter: requireAuth }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})


export default router