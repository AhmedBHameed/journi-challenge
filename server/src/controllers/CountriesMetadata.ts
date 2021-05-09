import {Request, Response} from 'express';
import {countries} from 'src/database/countries_metadata.json';
import logger from 'src/services/Logger';
import {redisClient} from 'src/services/redisClient';
import {getClientIp} from 'src/util/getClientIp';
import {haversineFormula} from 'src/util/haversineFormula';
import {ipStack} from 'src/util/ipStack';

interface Countries {
  name: string;
  distance: number;
}

interface SearchInput {
  latitude: number;
  longitude: number;
  searchValue: string;
}

const CountriesMetadataController = async (req: Request, res: Response) => {
  let countriesMetadata: Countries[] = [];
  const ipResult = getClientIp(req);

  const userInput = req.body as SearchInput;

  let isResultInMemory = false;
  try {
    const sortedCountriesAsJson = await redisClient.get(`${ipResult?.originalIp ?? ''}`);
    if (!sortedCountriesAsJson) throw 'No user data found in redis!';
    countriesMetadata = JSON.parse(sortedCountriesAsJson);
    isResultInMemory = true;
  } catch (catchError) {
    logger.error(catchError);
    isResultInMemory = false;
  }

  try {
    if (!isResultInMemory) {
      // const {error, result} = await ipStack('159.100.27.153'); // You can use this line for testing

      const {error, result} = await ipStack(ipResult?.ipv4 || '');
      if (error) {
        res.status(error.code).send({error});
        logger.error(error);
        return;
      }

      // The application using client IP by default and fallback to user location when not exists
      Object.assign(
        countriesMetadata,
        countries.map(country => {
          const distance = haversineFormula({
            sourceLat: result?.latitude || userInput.latitude,
            sourceLng: result?.longitude || userInput.longitude,
            destinationLat: country.lat,
            destinationLng: country.lng,
          });
          return {
            name: country.name,
            distance,
          };
        })
      );

      await redisClient.set(`${ipResult?.originalIp ?? ''}`, JSON.stringify(countriesMetadata), 'ex', 15); // Rough estimation time.
    }

    const filteredCountries = countriesMetadata
      .filter(country => country.name.toLowerCase().startsWith(userInput.searchValue.toLowerCase() || ''))
      .sort((currentCountry, nextCountry) => currentCountry.distance - nextCountry.distance);
    res.send(filteredCountries);
  } catch (catchError) {
    res.status(400).send({error: catchError?.message || 'Oops!! Something went wrong while ip stack checking'});
    return;
  }
};

export {CountriesMetadataController};
