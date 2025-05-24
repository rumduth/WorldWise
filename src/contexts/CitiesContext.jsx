import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from "react";

import {
  fetchCitiesAPI,
  fetchCityAPI,
  createCityAPI,
  deleteCityAPI,
  updateCityAPI,
} from "../services/citiesService";
import { useAuth } from "./AuthContext";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };

    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };

    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };

    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city._id !== action.payload),
        currentCity: {},
      };
    case "city/updated":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
        cities: state.cities.map((city) =>
          city._id === action.payload._id ? action.payload : city
        ),
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function loadCities() {
      dispatch({ type: "loading" });
      try {
        const data = await fetchCitiesAPI();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }

    loadCities();
  }, [user]);

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity._id || !user) return;
      dispatch({ type: "loading" });

      try {
        const data = await fetchCityAPI(id);
        dispatch({ type: "city/loaded", payload: data });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity._id, user]
  );

  async function createCity(newCity) {
    if (!user) return;
    dispatch({ type: "loading" });

    try {
      const data = await createCityAPI(newCity);
      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    if (!user) return;
    dispatch({ type: "loading" });

    try {
      await deleteCityAPI(id);
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }
  async function updateCity(id, updateData) {
    if (!user) return;
    dispatch({ type: "loading" });

    try {
      const data = await updateCityAPI(id, updateData);
      dispatch({ type: "city/updated", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error updating the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
        updateCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { CitiesProvider, useCities };
