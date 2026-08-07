import { useEffect, useState } from "react";

import AddressForm from "../components/AddressForm";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ResultCard from "../components/ResultCard";
import ConfidenceBar from "../components/ConfidenceBar";
import EvidenceCard from "../components/EvidenceCard";
import MapView from "../components/MapView";

import { useAddressContext } from "../context/AddressContext";

export default function Dashboard() {
  const { result, loading, error } = useAddressContext();

  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (err) => {
        console.log(err);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }, []);

  const destination =
    result?.latitude && result?.longitude
      ? {
          lat: result.latitude,
          lng: result.longitude,
        }
      : null;

  return (
    <div className="dashboard">

      <AddressForm />

      <ErrorMessage message={error} />

      {loading && <Loading />}

      {!loading && result && (
        <>
          <ResultCard result={result} />

          <ConfidenceBar
            score={result.confidence ?? result.score}
          />

          <EvidenceCard
            evidence={result.evidence ?? result.sources}
          />

          <MapView
            currentLocation={currentLocation}
            destination={destination}
            result={result}
          />
        </>
      )}
    </div>
  );
}