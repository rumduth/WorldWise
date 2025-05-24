import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!user) navigate("/");
    },
    [user, navigate]
  );

  return user ? children : null;
}

export default ProtectedRoute;
