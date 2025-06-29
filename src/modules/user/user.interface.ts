export interface User {
  id: bigint;
  email: string;
  password: string;
  name: string;
  phone: string | null; // Allow null for phone
  createdAt: Date;
  updatedAt: Date;
}

export type UserWithoutPassword = Omit<User, 'password'>;
