// Intercept and refresh expired tokens for multiple requests (same implementation but with some abstractions)
//
// HOW TO USE:
// import applyAppTokenRefreshInterceptor from 'axios.refresh_token.2.js';
// import axios from 'axios';
// ...
// applyAppTokenRefreshInterceptor(axios); // register the interceptor with all axios instance
// ...
// - Alternatively:
// const apiClient = axios.create({baseUrl: 'example.com/api'});
// applyAppTokenRefreshInterceptor(apiClient); // register the interceptor with one specific axios instance
// ...
// - With custom options:
// applyAppTokenRefreshInterceptor(apiClient, {
//      shouldIntercept: (error) => {
//          return error.response.data.errorCode === 'EXPIRED_ACCESS_TOKEN';
//      }
// ); // register the interceptor with one specific axios instance
//
// PS: You may need to figure out some minor things yourself as this is just a proof of concept and not a tutorial.
// Forgive me in advance
// import axios from "axios";
import store from "@/store/index"
import router from "@/router/index"

const shouldIntercept = (error) => {
  try {
    // console.log(Object(error));
    // console.log(error.response.config.url);
    return (error.response.status === 401) && (error.response.config.url !== "refresh")
  } catch (e) {
    return false;
  }
};

const setTokenData = (tokenData = {}, axiosClient) => {
  // If necessary: save to storage
  //   tokenData's content includes data from handleTokenRefresh(): {
  //     idToken: data.auth_token,
  //     refreshToken: data.refresh_token,
  //     expiresAt: data.expires_in,
  // };
  // console.log("INTERCEPTOR setTokenData")
  localStorage.setItem('token', tokenData.token);
  axiosClient.defaults.headers.common['Authorization'] = "Bearer " + tokenData.token;

};

const handleTokenRefresh = (axiosClient) => {
  const refreshToken = window.localStorage.getItem('token');
  return new Promise((resolve, reject) => {
    axiosClient.get('refresh', { refreshToken })
      .then(({ data }) => {
        const tokenData = {
          token: data.token,
          // refreshToken: data.refresh_token,
          // expiresAt: data.expires_at,
        };
        resolve(tokenData);
      })
      .catch((err) => {
        // console.log("INTERCEPTOR handleTokenRefresh rejected", err);
        // TODO: Interceptor
        // Catch if couldnt update, or token is invalid
        // check for status id for error
        console.error("token refresh err")
        store.dispatch('user/logout');
        router.push("/")
        // TODO

        reject(err);
      })
  });
};

const attachTokenToRequest = (request, token) => {
  // console.log(request)
  request.headers['Authorization'] = 'Bearer ' + token;

  // If there is an edge case where access token is also set in request query,
  // this is also a nice place to add it
  // Example: /orders?token=xyz-old-token
  // if (/\/orders/.test(request.url)) {
  //   request.params.token = token;
  // }
};

export default (axiosClient, customOptions = {}) => {
  let isRefreshing = false;
  let failedQueue = [];

  const options = {
    attachTokenToRequest,
    handleTokenRefresh,
    setTokenData,
    shouldIntercept,
    ...customOptions,
  };
  const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  const interceptor = (error) => {
    // Check if status is 401

    if([404, 500].includes(error?.response?.status)) {
      router.push({ name: "NotFound" });
      return Promise.reject(error);
    }

    if (!options.shouldIntercept(error)) {
      // console.log('rejected!!!');
      return Promise.reject(error);
    }

    if (error.config._retry || error.config._queued) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (isRefreshing) {
      return new Promise(function (resolve, reject) {
        failedQueue.push({ resolve, reject })
      }).then(token => {
        originalRequest._queued = true;
        options.attachTokenToRequest(originalRequest, token);
        return axiosClient.request(originalRequest);
      }).catch(() => {
        return Promise.reject(error); // Ignore refresh token request's "err" and return actual "error" for the original request
      })
    }

    originalRequest._retry = true;
    isRefreshing = true;
    return new Promise((resolve, reject) => {
      options.handleTokenRefresh.call(options.handleTokenRefresh, axiosClient)
        .then((tokenData) => {
          options.setTokenData(tokenData, axiosClient);
          options.attachTokenToRequest(originalRequest, tokenData.token);
          processQueue(null, tokenData.token);
          resolve(axiosClient.request(originalRequest));
        })
        .catch((err) => {
          processQueue(err, null);
          reject(err);
        })
        .finally(() => {
          isRefreshing = false;
        })
    });
  };

  axiosClient.interceptors.response.use(undefined, interceptor);
};
