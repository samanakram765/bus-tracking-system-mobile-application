import { useEffect, useState } from "react";

export default function useFirebaseCalls(Func) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const request = async () => {
    setLoading(true);
    try {
      const result = await Func();
      setLoading(false);
      setData(result);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    request();
  }, []);

  return {
    data,
    loading,
  };
}
