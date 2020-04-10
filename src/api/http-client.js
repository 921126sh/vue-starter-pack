import router from '@router';
import axios from 'axios';
import Vue from 'vue';

// axios 객체
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  }
});

/**
 * 에러 인터셉터다
 * @param { Object } error 에러
 */
const errorInterceptor = error => {
  switch(error.response.status) {
      case 400:
          Vue.notify({
            group: 'notifyApp',
            title: '에러!!',
            type: 'error',
            text: error,
            duration: -10
          })
          break;

      case 401:
          Vue.notify({
            group: 'notifyApp',
            title: '에러!!',
            type: 'error',
            text: error.message,
            duration: -10
          })

          localStorage.removeItem('token');
          router.push('/auth');
          break;

      default:
          Vue.notify({
            group: 'notifyApp',
            title: '에러!!',
            type: 'error',
            text: error.message,
            duration: -10
          })
  }

  return Promise.reject(handleError(error));
}

/**
 * 응답 인터셉터다
 * @param { Object } response 응답객체
 */
const responseInterceptor = response => {
  switch(response.status) {
      case 200:
          break;
      default:
  }

  return response;
}

  /**
   * 통신 에러처리 기본 핸들러 이다.
   *
   * @param error 에러
   */
  function handleError(error) {
    let errorBody;
    let errResponse;

    if (error && error.status === 0) {
      errorBody = {};
      errResponse = {
        status: errorBody.status ? errorBody.status : error.message || error,
        error: errorBody.error ? errorBody.error : error.message || error,
        message:
          "서버로부터 응답이 없습니다. 관리자에게 문의하여 주시기 바랍니다."
      };
    } else {
      errorBody = {};
      errResponse = error.error;

      console.error("An error occurred", error);

      errorBody = error.error || {};
      errResponse = {
        status: errorBody.status ? errorBody.status : (error.message || error),
        error: errorBody.error ? errorBody.error : (error.message || error),
        message: errorBody.message ? errorBody.message.replace('<br>', '\n') : error.message ? error.message.replace('<br>', '\n') : `${error.statusText}(${error.status})`
      }
    }

    return errResponse;
  }

// const getAuthToken = () => localStorage.getItem('token');

// const authInterceptor = (config) => {
//     config.headers.Authorization = getAuthToken();
//     return config;
// }
// http.interceptors.request.use(authInterceptor);
http.interceptors.response.use(responseInterceptor, errorInterceptor);

export default http;
