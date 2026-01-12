/**
 * Custom error class for content loading and validation errors
 */
export class ContentError extends Error {
  constructor(
    message: string,
    public readonly filePath?: string,
    public readonly itemIndex?: number
  ) {
    super(message);
    this.name = 'ContentError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentError);
    }
  }

  /**
   * Returns a human-readable error message with context
   */
  toString(): string {
    let message = this.message;
    if (this.filePath) {
      message += `\n  File: ${this.filePath}`;
    }
    if (this.itemIndex !== undefined) {
      message += `\n  Item index: ${this.itemIndex}`;
    }
    return message;
  }
}
