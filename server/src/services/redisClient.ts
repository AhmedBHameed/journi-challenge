import RedisClass, {Redis} from 'ioredis';
import environment from 'src/config/environment';

const {host, password, port} = environment.redis;

let redisClient: Redis;

const connectRedis = (): Promise<string> => {
  redisClient = new RedisClass({
    port,
    password,
    host,
    showFriendlyErrorStack: true,
  });

  return new Promise((resolve, reject) => {
    redisClient.on('connect', function () {
      resolve('Redis state: connected');
    });

    redisClient.on('error', function (error) {
      reject(error);
    });
  });
};

export {redisClient, connectRedis};
