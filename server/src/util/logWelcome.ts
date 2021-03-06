import environment from 'src/config/environment';

import showIp from './showIp';

const {port, version, isProd} = environment;

const logWelcome = (): void =>
  console.log(
    '\n\tš”ļø ###########################š”ļø',
    '\n\n\t Server is listening to:',
    `\n${showIp()
      .map(ip => `\n\t š http://${ip}:${port}`)
      .join('')}\n\n\t šØ Build ver: ${version}`,
    `\n\n\t š³ ${isProd ? 'Production' : 'Development'} mode`,
    '\n\n\tš”ļø ###########################š”ļø'
  );

export default logWelcome;
