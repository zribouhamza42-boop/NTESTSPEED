import axios from "axios";

const api = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Request interceptor injects the current access token
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor handles 401 token refresh queueing
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Guard: Only process 401s that haven't been tried yet
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never refresh tokens on endpoint queries for auth itself
    if (originalRequest.url?.includes("/api/auth/refresh") || originalRequest.url?.includes("/api/auth/login")) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject: (err: any) => {
            reject(err);
          }
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) {
      handleSessionFailure();
      return Promise.reject(error);
    }

    try {
      // Issue request directly via root axios instance (avoiding interceptor loop)
      const res = await axios.post("/api/auth/refresh", { refreshToken });
      const { accessToken: newAccessToken } = res.data;

      localStorage.setItem("access_token", newAccessToken);

      originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      
      processQueue(null, newAccessToken);
      isRefreshing = false;

      return api(originalRequest);
    } catch (refreshErr) {
      processQueue(refreshErr, null);
      isRefreshing = false;
      handleSessionFailure();
      return Promise.reject(refreshErr);
    }
  }
);

function handleSessionFailure() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("session_id");
  localStorage.removeItem("auth_user");
  
  sessionStorage.removeItem("auth_token");
  sessionStorage.removeItem("auth_user");

  // Dispatch global event for the React Context to react reactively
  window.dispatchEvent(new Event("unauthorized_session_timeout"));
}

export default api;
