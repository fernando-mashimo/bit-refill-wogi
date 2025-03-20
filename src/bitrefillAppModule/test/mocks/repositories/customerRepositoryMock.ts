import { User } from "../../../domain/entities/user";
import { ICustomerRepository } from "../../../domain/repositories/customerRepository";

export class CustomerRepositoryMock implements ICustomerRepository {
  getByEmail(): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  create(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
