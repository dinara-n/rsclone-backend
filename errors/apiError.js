export default class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'Unauthorized: User is not authorized');
  }

  static ForbiddenError() {
    return new ApiError(403, 'Forbidden: User is not allowed to perform that action');
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors);
  }
}
