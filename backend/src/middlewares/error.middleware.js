/**
 * Centralized error middleware.
 * Standardizes API error responses: 400, 401, 403, 409, 500.
 */
function errorMiddleware(err, req, res, next) {
  const status = err.status ?? err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';
  const code = err.code ?? (status === 500 ? 'INTERNAL_ERROR' : undefined);

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    message,
    ...(code && { code }),
  });
}

module.exports = { errorMiddleware };
