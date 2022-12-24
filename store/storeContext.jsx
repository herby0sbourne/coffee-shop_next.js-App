import { createContext, useReducer } from "react";
import createAction from "../utils/createAction";

const INITIAL_STATE = {
  latLong: "",
  coffeeStores: [],
};

export const ACTION_TYPES = {
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {
        ...state,
        latLong: payload,
        // latLong: payload.latLong,
      };
    case ACTION_TYPES.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStores: payload,
        // coffeeStores: payload.coffeeStores,
      };
    default:
      throw new Error(`unhandled error type ${type} in storeReducer`);
  }
};

export const StoreContext = createContext(INITIAL_STATE);

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE);

  const getUserLocation = (location) => {
    dispatch(createAction(ACTION_TYPES.SET_LAT_LONG, location));
  };

  const getCoffeeStoreNearBy = (coffeeStores) => {
    dispatch(createAction(ACTION_TYPES.SET_COFFEE_STORES, coffeeStores));
  };

  return (
    <StoreContext.Provider
      value={{ state, getUserLocation, getCoffeeStoreNearBy }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider