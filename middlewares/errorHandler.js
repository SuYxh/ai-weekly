import { fail } from '../utils/response.js';

export default function errorHandler(err, req, res, next) {
  console.error(`[Error] ${err.stack || err.message || err}`);
  
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json(fail(message));
}
