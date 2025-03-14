import { User } from "../entities/user";

export interface ICustomerRepository {
  getByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<void>;
}
