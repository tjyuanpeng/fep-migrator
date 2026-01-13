import axios, { isCancel } from 'axios'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import { ElMessage } from 'element-plus'
import { clearUserData, logoutConfirm } from '@/utils/loginManager'
import { useProfileStore } from '@/stores/profile'
import router from '@/router'
import messageApi from '@/utils/message'

const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL,
  timeout: 30000
})

export default axiosInstance
