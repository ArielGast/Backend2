export default class CustomError {
    static createCustomError({ name, message, cause }) {
      const newError = new Error();
      newError.name = name;
      newError.message = message;
      newError.cause = cause;
      throw newError
    }
}