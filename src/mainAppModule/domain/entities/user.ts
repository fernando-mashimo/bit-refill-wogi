import { Entity } from "./common/entity";
import { UserRole } from "./enums/userRole";

export class User extends Entity {
  private _name: string;
  private _email: string;
  private _role: UserRole;
  private _phone: string;
  private _address: string;

  constructor(
    name: string,
    email: string,
    role: UserRole,
    phone: string,
    address: string
  ) {
    super();

    this._name = name;
    this._email = email;
    this._role = role;
    this._phone = phone;
    this._address = address;
  }

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }

  public get email(): string {
    return this._email;
  }

  public set email(value: string) {
    this._email = value;
  }

  public get role(): UserRole {
    return this._role;
  }

  public set role(value: UserRole) {
    this._role = value;
  }

  public get phone(): string {
    return this._phone;
  }

  public set phone(value: string) {
    this._phone = value;
  }

  public get address(): string {
    return this._address;
  }

  public set address(value: string) {
    this._address = value;
  }

  public static load(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    phone: string,
    address: string,
    createdAt: Date,
    isDeleted: boolean,
    deletedAt: Date | null
  ): User {
    const user = new User(name, email, role, phone, address);
    user._phone = phone;
    user._address = address;

    user._id = id;
    user._createdAt = createdAt;
    user._isDeleted = isDeleted;
    user._deletedAt = deletedAt;

    return user;
  }
}
