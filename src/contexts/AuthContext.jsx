import { createContext, useContext, useReducer } from "react";
import { authAPI } from "../services/authService";
import { userAPI } from "../services/userService";
const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        user: action.payload.user,
      };
    case "register":
      return {
        user: action.payload.user,
      };
    case "logout":
      return {
        user: null,
      };
    case "update_profile":
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function AuthProvider({ children }) {
  const [{ user }, dispatch] = useReducer(reducer, initialState);

  async function login(email, password) {
    try {
      const data = await authAPI("login", "POST", { email, password });

      localStorage.setItem("user", JSON.stringify(data.user));

      dispatch({
        type: "login",
        payload: { user: data.user },
      });
    } catch (err) {
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
      throw err;
    }
  }

  async function toggleLikeCountry(country) {
    try {
      const data = await userAPI("like-country", "POST", { country });

      const updatedUser = { ...user, likedCountries: data.likedCountries };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      dispatch({
        type: "update_profile",
        payload: { likedCountries: data.likedCountries },
      });

      return data;
    } catch (err) {
      throw err;
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        toggleLikeCountry,
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
