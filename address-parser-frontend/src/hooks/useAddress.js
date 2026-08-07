import { useCallback } from "react";
import { parseAddress } from "../services/api";
import { useAddressContext } from "../context/AddressContext";

export function useAddress() {
  const {
    setResult,
    setLoading,
    setError,
  } = useAddressContext();

  const submitAddress = useCallback(
    async (rawAddress) => {

      if (!rawAddress.trim()) {
        setError("Please enter an address.");
        return;
      }

      setLoading(true);
      setError(null);
      setResult(null);

      try {

        const response = await parseAddress(
          rawAddress.trim()
        );

        if (!response) {
          throw new Error("No response from server.");
        }

        if (
          response.latitude == null ||
          response.longitude == null
        ) {
          throw new Error(
            "Coordinates not found."
          );
        }

        setResult(response);

      } catch (error) {

        console.error(error);

        setError(
          error.response?.data?.message ||
          error.message ||
          "Unable to locate address."
        );

      } finally {
        setLoading(false);
      }

    },
    [setLoading, setResult, setError]
  );

  return {
    submitAddress,
  };
}