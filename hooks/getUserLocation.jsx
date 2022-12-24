import { useContext, useState } from "react";
import { StoreContext } from "../store/storeContext";

const useTrackLocation = () => {
  const { getUserLocation } = useContext(StoreContext);
  const [locationErrorMsg, setLocationErrorMsg] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = (position) => {
    const { latitude, longitude } = position.coords;

    getUserLocation(`${latitude},${longitude}`);

    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrorMsg("unable to retrieve your location");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setLocationErrorMsg("");
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    }

    navigator.geolocation.getCurrentPosition(success, error);
  };

  return {
    locationErrorMsg,
    isFindingLocation,
    handleTrackLocation,
  };
};

export default useTrackLocation;
