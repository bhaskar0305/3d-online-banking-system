import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:8080/api",
});

API.interceptors.request.use((req) =>{
    const token = localStorage.getItem('token');
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register/', data);
export const getAccount = () => API.get('/banking/account');
export const transferMoney = (data) => API.post('/banking/transer', data)
export const getTransactions = () => API.get('/banking/transactions');

export default API;