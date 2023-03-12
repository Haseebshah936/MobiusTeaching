import { createContext, useContext } from "react";

const AppContext = createContext(null);

type CustomContextProviderProps = {
  children: React.ReactNode;
  value: any;
};

export const CustomContextProvider = ({
  children,
  value,
}: CustomContextProviderProps) => {
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useCustomContext = () => {
  return useContext(AppContext);
};
