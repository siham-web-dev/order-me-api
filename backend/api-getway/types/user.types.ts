export interface User {
  id: string;
  email: string;
  password: string; // Consider excluding this in responses
  fullName: string;
  phone?: string;
}
