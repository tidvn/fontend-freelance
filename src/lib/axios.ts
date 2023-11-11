import { BACKEND_URL } from '@/env'
import Axios from 'axios'

const axios = Axios.create({
    baseURL: BACKEND_URL,
})

export default axios