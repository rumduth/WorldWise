// src/components/User.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./User.module.css";

function User() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  function handleProfileClick() {
    navigate("/app/profile");
  }

  return (
    <div className={styles.user}>
      <img 
        src={user.avatar || `https://i.pravatar.cc/100?u=${user.email}`} 
        alt={user.username} 
        onClick={handleProfileClick}
        className={styles.avatar}
      />
      <span>Welcome, {user.username}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default User;