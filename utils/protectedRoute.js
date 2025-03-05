import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const protectedRoute = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) return <div className="loader"></div>

    return <WrappedComponent {...props} />;
  };
};

export default protectedRoute;
