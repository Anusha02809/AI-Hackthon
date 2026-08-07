import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Request logging
api.interceptors.request.use((config) => {
  console.log(
    `API Request: ${config.method?.toUpperCase()} ${config.url}`
  );
  return config;
});

// Optional: Response logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response) {
      throw {
        response: error.response,
        message:
          error.response.data?.message ||
          error.response.data?.detail ||
          "Server Error",
      };
    }

    throw {
      message: "Unable to connect to backend.",
    };
  }
);

export async function parseAddress(address) {
  const response = await api.post("/parse-address", {
    address,
  });

  return {
    cleaned_address:
      response.data.cleaned_address ??
      response.data.formatted_address,

    latitude: response.data.latitude,

    longitude: response.data.longitude,

    confidence:
      response.data.confidence ??
      response.data.score,

    evidence:
      response.data.evidence ??
      response.data.sources ??
      [],

    ...response.data,
  };
}

export default api;