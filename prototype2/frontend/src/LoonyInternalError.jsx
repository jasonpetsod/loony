export default function LoonyInternalError(message) {
  this.message = `Loony internal error: ${message}`;
}

LoonyInternalError.prototype = Object.create(Error.prototype);
LoonyInternalError.prototype.constructor = LoonyInternalError;
