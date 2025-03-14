import { UserRole } from "../../entities/enums/userRole";
import { User } from "../../entities/user";
import { UserAlreadyExistsError } from "../../errors/userAlreadyExistsError";
import { ICustomerRepository } from "../../repositories/customerRepository";
import { UseCase } from "../common/useCase";
import { CreateCustomerUseCaseInput } from "./input";
import { CreateCustomerUseCaseOutput } from "./output";

export class CreateCustomerUseCase
  implements UseCase<CreateCustomerUseCaseInput, CreateCustomerUseCaseOutput>
{
  private customerRepository: ICustomerRepository;

  constructor(customererRepository: ICustomerRepository) {
    this.customerRepository = customererRepository;
  }

  public async execute(
    input: CreateCustomerUseCaseInput
  ): Promise<CreateCustomerUseCaseOutput> {
    try {
      await this.verifyExistingUser(input.email);

      const customer = new User(
        input.name,
        input.email,
        UserRole.CUSTOMER,
        input.phone,
        input.address
      );
      await this.customerRepository.create(customer);

      return { customerId: customer.id };
    } catch (error) {
      console.error(
        `Cannot create customer with input ${input.name} and ${input.email}`,
        error
      );
      throw error;
    }
  }

  private async verifyExistingUser(email: string): Promise<void> {
    const existingUser = await this.customerRepository.getByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError(email);
    }
  }
}
