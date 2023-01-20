import { useState } from "react";

export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const request = async (...args) => {
    setLoading(true);

    const result = await apiFunc(...args);

    setData(result);
    setLoading(false);
  };

  return {
    loading,
    data,
    request,
  };
};
