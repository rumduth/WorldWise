import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import styles from "./Profile.module.css";

function Profile() {
  const { user, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: user.username || "",
    avatar: user.avatar || "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  }

  async function handleProfileSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await updateProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords don't match" });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message || "Failed to update password" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.profile}>
        <button 
        onClick={() => navigate(-1)} 
        className={styles.backButton}
      >
        &larr; Back
      </button>
      <h1>Your Profile</h1>
      
      {message.text && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}
      
      <div className={styles.container}>
        <div className={styles.avatarSection}>
          <img 
            src={formData.avatar || "https://i.pravatar.cc/100?u=" + user.email} 
            alt={user.username} 
            className={styles.avatar}
          />
        </div>
        
        <div className={styles.formSection}>
          <form onSubmit={handleProfileSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="avatar">Avatar URL</label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <small>Leave empty to use default avatar</small>
            </div>
            
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Profile"}
            </button>
          </form>
          
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.button}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
      
    
    </div>
  );
}

export default Profile;