import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <p>Authenticating...</p>;
};

export default AuthCallback;
