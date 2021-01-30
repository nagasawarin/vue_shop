import Vue from 'vue'
import VueRouter from 'vue-router'

const Login = () => import('components/Login');
const Home = () => import('components/Home');
const Welcome = () => import("components/home/Welcome");
const Users = () => import("components/home/Users");
const Roles = () => import("components/home/power/Roles");
const Rights = () => import("components/home/power/Rights");
const Goods = () => import("components/home/goods/Goods");
const Params = () => import("components/home/goods/Params");
const Categories = () => import("components/home/goods/Categories");
const Orders = () => import("components/home/Orders");
const Reports = () => import("components/home/Reports");

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/home/welcome',
    children: [
      {
        path: 'welcome',
        component: Welcome
      },
      {
        path: 'users',
        component: Users
      },
      {
        path: 'roles',
        component: Roles
      },
      {
        path: 'rights',
        component: Rights
      },
      {
        path: 'goods',
        component: Goods
      },
      {
        path: 'params',
        component: Params
      },
      {
        path: 'categories',
        component: Categories
      },
      {
        path: 'orders',
        component: Orders
      },
      {
        path: 'reports',
        component: Reports
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  // 若用户访问登陆页面则直接放行
  if (to.path === '/login') return next();

  // 若用户没有携带token则强制跳转到登陆页面
  const token = window.sessionStorage.getItem("token");
  if (!token) {
    alert("请先登陆用户");
    return next('/login');
  }

  // 若用户带有token则放行
  next();
});

export default router
