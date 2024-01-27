//? Feature context types

export type initialFeatureContextStateType = {
  showAlert: boolean;
  alertText: string;
  alertSuccess: boolean;
  isLoading: boolean;
};

export type FeatureContextType = {
  state: initialFeatureContextStateType;
  displayAlert: (alertText: string, Success: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export type featureContextActionsType = {
  type: string;
  payload?: {
    type?: boolean;
    text?: string;
    isLoading?: boolean;
  };
};
