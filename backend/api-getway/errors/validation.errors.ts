import { ValidationErrorItem } from "joi";

export class ValidationError extends Error {
  constructor(
    public message: string,
    public details: ValidationErrorItem[] = []
  ) {
    super(message);
    this.name = "ValidationError";
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }

  /**
   * Formats Joi validation errors into a more client-friendly structure
   */
  public toJSON() {
    return {
      error: this.name,
      message: this.message,
      details: this.details.map((item) => ({
        field: item.path.join("."),
        message: item.message,
        type: item.type,
      })),
    };
  }
}
