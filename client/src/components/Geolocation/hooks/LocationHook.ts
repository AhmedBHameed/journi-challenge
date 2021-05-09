import { useCallback, useEffect } from "react";

const useGeoLocation = () => {
  const getCurrentLocation = useCallback(async () => {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve([position.coords.latitude, position.coords.longitude] as [
          number,
          number
        ]);
      });
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);

  return { getCurrentLocation };
};

export default useGeoLocation;
