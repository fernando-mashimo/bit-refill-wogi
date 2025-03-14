import { CreateCustomerUseCase } from "..";
import { CustomerMock } from "../../../../test/mocks/entities/Customer";
import { CustomerRepositoryMock } from "../../../../test/mocks/repositories/customerRepositoryMock";
import { UserRole } from "../../../entities/enums/userRole";
import { User } from "../../../entities/user";
import { UserAlreadyExistsError } from "../../../errors/userAlreadyExistsError";
import { CreateCustomerUseCaseInput } from "../input";

const customerRepository = new CustomerRepositoryMock();
const createUserUseCase = new CreateCustomerUseCase(customerRepository);

const input: CreateCustomerUseCaseInput = {
  name: "Random Name",
  email: "randomMail@mail.com",
  phone: "any phone",
  address: "any address",
};

let customerRepositoryCreateSpy: jest.SpyInstance;

beforeEach(() => {
  jest.restoreAllMocks();

  jest
    .spyOn(CustomerRepositoryMock.prototype, "getByEmail")
    .mockImplementation(() => Promise.resolve(null));

  customerRepositoryCreateSpy = jest
    .spyOn(CustomerRepositoryMock.prototype, "create")
    .mockImplementation(() => Promise.resolve());
});

describe("Should create a customer", () => {
  test("when provided input data (mail) is valid", async () => {
    const result = await createUserUseCase.execute(input);

    expect(typeof result.customerId).toBe("string");
    expect(customerRepositoryCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining<Partial<User>>({
        id: expect.any(String),
        name: input.name,
        email: input.email,
        role: UserRole.CUSTOMER,
        phone: input.phone,
        address: input.address,
        createdAt: expect.any(Date),
        isDeleted: false,
        deletedAt: null,
      })
    );
  });
});

describe("Should not create a customer", () => {
  test("when user with provided input data (mail) already exists", async () => {
    jest
      .spyOn(CustomerRepositoryMock.prototype, "getByEmail")
      .mockImplementation(() => Promise.resolve(CustomerMock()));

    const userAlreadyExistsError = new UserAlreadyExistsError(input.email);

    await expect(createUserUseCase.execute(input)).rejects.toThrow(
      userAlreadyExistsError
    );
  });
});
