import axios, { isCancel } from 'axios'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import { ElMessage } from 'element-plus'
import { clearUserData, logoutConfirm } from '@/utils/loginManager'
import { useProfileStore } from '@/stores/profile'
import router from '@/router'
import messageApi from '@/utils/message'

const baseURL = import.meta.env.VITE_API_BASE_URL

let expiredToken = ''

const processloginExpired = () => {
  clearUserData()
  messageApi.close()
  router.push({
    name: 'login',
    query: { redirect: router.currentRoute.value.fullPath }
  })
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  (response) => {
    const resData = response.data
    if (resData instanceof Blob) {
      return response
    }

    if (resData.code === 403) {
      // const isNeedLogin = localStorage.getItem('isNeedLogin')
      // if (isNeedLogin) {
      //   return Promise.reject('Login expired')
      // }
      if (localStorage.getItem('token') === expiredToken) {
        return Promise.reject('Login expired')
      }
      expiredToken = localStorage.getItem('token') || ''

      const profileStore = useProfileStore()
      // 根据是否有用户名判断是否为首次进入网页登录过期
      if (profileStore.nickName) {
        localStorage.setItem('isNeedLogin', 'true')
        logoutConfirm()
        // ElMessageBox.confirm('登录已过期, 是否重新登录?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // })
        //   .then(() => {
        //     processloginExpired()
        //   })
        //   .catch(() => {
        //     //选择不重新登录时，确保下次请求仍然弹出确认框
        //     expiredToken = ''
        //   })
      } else {
        ElMessage({
          message: '登录已过期',
          type: 'warning',
          grouping: true
        })
        processloginExpired()
      }
      return Promise.reject('Login expired')
    }

    if (!resData.success) {
      const errorMsg = resData.message || '服务器错误'
      ElMessage({
        message: errorMsg,
        dangerouslyUseHTMLString: true,
        type: 'error',
        grouping: true
      })

      return Promise.reject(errorMsg)
    }

    return response
  },
  (error) => {
    if (isCancel(error)) {
      return Promise.reject(error)
    }
    ElMessage({
      message: '网络错误',
      type: 'error',
      grouping: true
    })
    return Promise.reject(error)
  }
)

export default axiosInstance
