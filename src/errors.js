function ParseError(message) {
  this.message = `Parse error: ${message}`;
}
ParseError.prototype = Object.create(Error.prototype);
ParseError.prototype.constructor = ParseError;

export default { ParseError };
