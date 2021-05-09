import logger from 'src/services/Logger';

const initLogger = () => {
  process
    .on('unhandledRejection', reason => {
      if (reason) {
        logger.error(``, reason, () => {
          throw reason;
        });
      }
    })
    .on('uncaughtException', error => {
      logger.error(``, error, () => {
        throw error;
      });
    });
};

export default initLogger;
