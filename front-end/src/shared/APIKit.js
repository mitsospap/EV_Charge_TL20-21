//<ROOT>/shared/APIKit.js
import axios from 'axios';

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  baseURL: 'http://localhost:8765/evcharge/api',
  timeout: 10000,
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = token => {
  APIKit.interceptors.request.use(function(config) {
    config.headers.Authorization = `${token}`;
    return config;
  });
};

export default APIKit;