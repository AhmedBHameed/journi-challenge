import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Autocomplete from "./components/Form/Autocomplete/Autocomplete";
import useGeoLocation from "./components/Geolocation/hooks/LocationHook";
import { httpClient } from "./util/httpClient";

interface CountryModel {
  name: string;
}

function App() {
  const { getCurrentLocation } = useGeoLocation();

  const [countries, setCountries] = useState<CountryModel[]>([]);

  const fetchCountry = useCallback(
    async (value: string) => {
      let geoLocation;
      try {
        geoLocation = await getCurrentLocation();
      } catch (catchError) {
        console.log(catchError);
      }

      try {
        const response = await httpClient.post("/api/v1/closest-countries", {
          searchValue: value,
          coordinates: geoLocation,
        });
        setCountries(response.data);
      } catch (error) {
        console.log(error);
      }
    },
    [getCurrentLocation, setCountries]
  );

  useEffect(() => {
    fetchCountry("");
  }, [fetchCountry]);

  return (
    <div className="container">
      <Autocomplete data={countries} onSearch={fetchCountry} />
    </div>
  );
}

export default App;
