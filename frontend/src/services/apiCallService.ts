import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';


const docker = false;
const baseURL = docker? 'http://localhost:8080/api' : 'http://127.0.0.1:8000/api'

type ApiCallParams = {
  method: 'GET' | 'POST' | 'DELETE',
  data?: {},
  params?: {},
  requiresAuth?: boolean
}
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const apiCall = async (
  endpoint: string,
  {
    method = 'GET',
    data,
    params,
    requiresAuth }
    : ApiCallParams
) => {
  try {
    const headers: AxiosRequestConfig['headers'] = {};

    if (requiresAuth) {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found, authorization required');
      }
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await api({
      url: endpoint,
      method: method.toLowerCase(),
      data,
      params,
      headers,
    });

    return response.data;
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
};

export default apiCall;
