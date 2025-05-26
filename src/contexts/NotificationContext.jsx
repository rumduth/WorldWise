import { createContext, useContext, useReducer } from "react";

const NotificationContext = createContext();

const initialState = { notifications: [] };

function reducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        notifications: [
          ...state.notifications,
          { id: Date.now(), ...action.payload },
        ],
      };
    case "remove":
      return {
        notifications: state.notifications.filter(
          (n) => n.id !== action.payload
        ),
      };
    default:
      throw new Error("Unknown action");
  }
}

export function NotificationProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const addNotification = (message, type = "info") => {
    dispatch({ type: "add", payload: { message, type } });
  };

  const removeNotification = (id) => {
    dispatch({ type: "remove", payload: id });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: state.notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context)
    throw new Error("useNotification must be used within NotificationProvider");
  return context;
}
