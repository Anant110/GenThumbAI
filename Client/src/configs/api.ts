import axios from 'axios' //axios is the library which is used to make the http request

// this creates a custom axios instance
const api=axios.create({
    // use the base url,url comes from the the env file
    baseURL:import.meta.env.VITE_BASE_URL || "http://localhost:3000",
    // it means send cookies/sessions data with every requests
    withCredentials:true
})

export default api
