"use client";

import { createContext, useContext, useReducer } from "react";

import { DISPLAY_ALERT, CLEAR_ALERT, SET_IS_LOADING } from "../actions";

import reducer from "./reducer";
import {
  FeatureContextType,
  initialFeatureContextStateType,
} from "@/types/context";

const initialState: initialFeatureContextStateType = {
  showAlert: false,
  alertText: "",
  alertSuccess: false,
  isLoading: true,
};

const initialContextValue: FeatureContextType = {
  state: initialState,
  displayAlert: () => {},
  setIsLoading: () => {},
};

const FeatureContext = createContext<FeatureContextType>(initialContextValue);

const FeatureProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({
        type: CLEAR_ALERT,
      });
    }, 3000);
  };

  /**
   *
   * @param alertText The message to display
   * @param Success alert type => if true, green | red alert
   */

  const displayAlert = (alertText: string, Success = true) => {
    dispatch({
      type: DISPLAY_ALERT,
      payload: {
        type: Success,
        text: alertText,
      },
    });
    clearAlert();
  };

  /**
   *
   * @param isLoading if true show the alert else hide the alert
   */

  const setIsLoading = (isLoading: boolean) => {
    dispatch({ type: SET_IS_LOADING, payload: { isLoading: isLoading } });
  };

  return (
    <FeatureContext.Provider
      value={{
        state,
        setIsLoading,
        displayAlert,
      }}
    >
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeatureContext = () => {
  return useContext(FeatureContext);
};

export default FeatureProvider;
