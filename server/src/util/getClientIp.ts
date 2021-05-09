import {Request} from 'express';

export function getClientIp(req: Request) {
  /**
   * [x-client-ip] is Standard headers used by Amazon EC2, Heroku, and others.
   * @see https://github.com/pbojinov/request-ip/blob/master/src/index.js#L53
   * [X-Real-IP] is what i use for my nginx
   */
  const originalIp =
    ((req.headers['x-client-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.headers['X-Real-IP'] ||
      req.socket.remoteAddress) as string) || null;
  if (!originalIp) return null;

  /**
   * That might be not the best practice to parse ipv4 client ip address but this topic need a library
   * with fair amount of search to determine edge cases.
   */
  const ipSections = originalIp.split(',')[0];
  return {originalIp, ipv4: ipSections.split(':').slice(-1)[0]};
}
