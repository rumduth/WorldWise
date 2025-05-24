// src/contexts/AuthContext.jsx
import { createContext, useContext, useReducer } from "react";
import { authAPI } from "../services/authService";
import { userAPI } from "../services/userService";
const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        user: action.payload.user,
        error: null,
      };
    case "register":
      return {
        user: action.payload.user,
        error: null,
      };
    case "logout":
      return {
        user: null,
        error: null,
      };
    case "update_profile":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        error: null,
      };
    case "error":
      return {
        ...state,
        error: action.payload,
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function AuthProvider({ children }) {
  const [{ user, error }, dispatch] = useReducer(reducer, initialState);

  async function login(email, password) {
    try {
      const data = await authAPI("login", "POST", { email, password });

      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: "login",
        payload: { user: data.user },
      });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      throw err;
    }
  }

  async function register(username, email, password) {
    try {
      const data = await authAPI("register", "POST", {
        username,
        email,
        password,
      });

      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: "register",
        payload: { user: data.user },
      });
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      throw err;
    }
  }

  async function logout() {
    localStorage.removeItem("user");
    await authAPI("logout", "POST");
    dispatch({ type: "logout" });
  }

  async function updateProfile(profileData) {
    try {
      const data = await userAPI("profile", "PUT", profileData);
      
      // Update local storage with new user data
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      dispatch({
        type: "update_profile",
        payload: data.user,
      });
      
      return data;
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      throw err;
    }
  }
  
  async function updatePassword(currentPassword, newPassword) {
    try {
      const data = await userAPI("password", "PUT", {
        currentPassword,
        newPassword,
      });
      
      return data;
    } catch (err) {
      dispatch({ type: "error", payload: err.message });
      throw err;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside AuthProvider");
  return context;
}