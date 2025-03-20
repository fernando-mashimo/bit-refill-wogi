import { randomUUID } from "node:crypto";

export class Entity {
  protected _id: string;
  protected _createdAt: Date;
  protected _isDeleted: boolean;
  protected _deletedAt: Date | null;

  constructor() {
    this._id = randomUUID().toString();
    this._createdAt = new Date();
    this._isDeleted = false;
    this._deletedAt = null;
  }

  public get id(): string {
    return this._id;
  }

  public get createdAt(): Date {
    return this._createdAt;
  }

  public get isDeleted(): boolean {
    return this._isDeleted;
  }

  public set isDeleted(value: boolean) {
    this._isDeleted = value;
  }

  public get deletedAt(): Date | null {
    return this._deletedAt;
  }

  public set deletedAt(value: Date) {
    this._deletedAt = value;
  }
}
