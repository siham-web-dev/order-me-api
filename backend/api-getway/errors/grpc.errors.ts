export class GrpcError extends Error {
  constructor(
    public message: string,
    public service: string,
    public code: number
  ) {
    super(message);
    this.name = "GrpcError";
  }
}
