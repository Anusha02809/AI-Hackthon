import { useState } from "react";
import { useAddress } from "../hooks/useAddress";
import { useAddressContext } from "../context/AddressContext";

export default function AddressForm() {
  const [address, setAddress] = useState("");

  const { submitAddress } = useAddress();
  const { loading } = useAddressContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!address.trim()) {
      alert("Please enter an address.");
      return;
    }

    submitAddress(address.trim());
  };

  return (
    <div className="card">

      <h2 className="card-title">
        Address Intelligence
      </h2>

      <p className="card-subtitle">
        Enter a messy Indian address and we'll locate it.
      </p>

      <form
        className="address-form"
        onSubmit={handleSubmit}
      >
        <textarea
          className="address-input"
          rows={4}
          value={address}
          disabled={loading}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Example:
Near Ganesh Temple,
Opp SBI Bank,
Guntur"
        />

        <button
          className="btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Finding Location..."
            : "📍 Find Location"}
        </button>
      </form>
    </div>
  );
}