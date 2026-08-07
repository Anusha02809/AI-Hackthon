import { createContext, useContext, useState } from "react";

const AddressContext = createContext();

export function AddressProvider({ children }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clear = () => {
    setResult(null);
    setError(null);
  };

  return (
    <AddressContext.Provider
      value={{
        result,
        setResult,

        loading,
        setLoading,

        error,
        setError,

        clear,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddressContext() {
  const context = useContext(AddressContext);

  if (!context) {
    throw new Error(
      "useAddressContext must be used inside AddressProvider"
    );
  }

  return context;
}