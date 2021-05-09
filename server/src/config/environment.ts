const {BUILD_ENV, LOG_LEVEL, VERSION, REDIS_HOST, REDIS_PASSWORD} = process.env;

const isProd = BUILD_ENV === 'production';

const port = '5000';
const allowDomains = ['http://localhost:5000', 'http://localhost:3000'];

export default {
  allowDomains,
  version: VERSION,
  isProd,
  logs: {
    dir: 'logs',
    level: LOG_LEVEL || 'silly',
  },
  port,
  ipStackToken: 'a1d5abe0fd6709ed6ee80744cc29def2',
  redis: {
    host: REDIS_HOST,
    password: REDIS_PASSWORD,
    port: parseInt(process.env.REDIS_PORT || '6379'),
  },
};
