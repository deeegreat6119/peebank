import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import baseUrl from "./Constants";

const AuthGuard = ({ children }) => {
  const [User, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    fetch(`${baseUrl}/dashboard`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (response) => {
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }
        return response.json();
      })
      .then((data) => {
        setIsLoading(false);
        if (data?.status === "success" || data?.success) {
          setUser(data.data || {});
        } else {
          navigate("/sign-in");
        }
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        navigate("/sign-in");
        localStorage.removeItem("token");
      });
  }, [navigate]);
  if (isLoading) {
    return (
      <div class="peebank-loader">
        <div class="peebank-logo">
          <div class="coin coin-1"></div>
          <div class="coin coin-2"></div>
          <div class="coin coin-3"></div>
          <span class="logo-text">Peebank</span>
        </div>
        <p class="loading-text">Securing your transactions...</p>
      </div>
    );
  } else if (User) {
    return <>{children}</>;
  }

  return <div>AuthGuard</div>;
};

export default AuthGuard;
