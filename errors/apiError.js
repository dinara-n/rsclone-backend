export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }

  static UnauthorizedError(message) {
    return new ApiError(401, 'Unauthorized: User is not authorized', message);
  }

  static ForbiddenError(message) {
    return new ApiError(403, 'Forbidden: User is not allowed to perform that action', message);
  }

  static NotFoundError(message) {
    return new ApiError(404, 'Not found: the requested resource is not found', message);
  }
}
