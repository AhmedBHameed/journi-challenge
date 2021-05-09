import http from 'http';
import environment from 'src/config/environment';

interface IpStackModel {
  // ip: '8.8.8.8',
  // type: 'ipv4',
  // continent_code: 'NA',
  // continent_name: 'North America',
  // country_code: 'US',
  // country_name: 'United States',
  // region_code: 'CA',
  // region_name: 'California',
  // city: 'Mountain View',
  // zip: '94041',
  latitude: number;
  longitude: number;
  // location: {
  //   geoname_id: 5375480,
  //   capital: 'Washington D.C.',
  //   languages: [ [Object] ],
  //   country_flag: 'http://assets.ipstack.com/flags/us.svg',
  //   country_flag_emoji: '🇺🇸',
  //   country_flag_emoji_unicode: 'U+1F1FA U+1F1F8',
  //   calling_code: '1',
  //   is_eu: false
  // }
}

interface IpStackError {
  code: number;
  type: string;
  info: string;
}

export const ipStack = (ip): Promise<{error: IpStackError | null; result: IpStackModel | null}> => {
  return new Promise((resolve, reject) => {
    http.get(
      {
        hostname: 'api.ipstack.com',
        port: 80,
        path: `/${ip}?access_key=${environment.ipStackToken}`,
        agent: false,
      },
      res => {
        let body: any = '';
        res.on('data', data => {
          body += data;
        });

        res.on('end', () => {
          body = JSON.parse(body);
          const {error} = body;
          if (error !== undefined) {
            resolve({error, result: null});
          } else {
            resolve({error: null, result: body});
          }
        });

        res.on('error', reject);
      }
    );
  });
};
