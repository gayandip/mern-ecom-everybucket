import { useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export function useApiPost() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const post = async (url, body, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(url, body, options);
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { post, data, loading, error };
}
