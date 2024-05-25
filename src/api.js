import axios from 'axios'
import { ACCESS_TOKEN } from './constants'

const api = axios.create({
    /* - An instance of axios is created and assigned to the 'api' variable
       - This instance is configured with a 'baseURL' which is set to the value of 'VITE_API_URL'
         from the environment variables. 'import.meta.env' is a way to access environment variables
         in Vite, a frontend build tool.
    */
    baseURL: import.meta.env.VITE_API_URL
})
/* In the context of axios, interceptors are functions that axios calls 
   before a request is sent or before a response is handled. They allow you 
   modify requests or responses before they are handled by the then or catch
   methods
*/
api.interceptors.request.use(
    /* use is a method provided by axios to register interceptors. It takes
       two functions as arguments: one for handling the request before it is
       sent and one for handling errors.
    */
   /*  This is an arrow function that takes a config object as its argument. The 
       config object contains details about the request being made, such as the URL,
       headers, method etc.
   */
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
        // returns a Promise that is rejected with the given error. This is useful
        // for propagating errors in asynchronous code
    }
)

export default api 