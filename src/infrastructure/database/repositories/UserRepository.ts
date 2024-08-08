import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel, IUserDocument } from '../models/UserModel';

export class UserRepository implements IUserRepository {
  async createUser(user: User): Promise<User> {
    const createdUser = new UserModel(user);
    await createdUser.save();
    return this.toDomain(createdUser);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ email }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findUserByCPF(cpf: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ cpf }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findUserByPhone(phone: string): Promise<User | null> {
    const userDocument = await UserModel.findOne({ phone }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const userDocument = await UserModel.findById(id).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async updateUser(user: User): Promise<User> {
    const userDocument = await UserModel.findByIdAndUpdate(user.id, user, { new: true }).exec();
    return this.toDomain(userDocument);
  }

  async deleteUserById(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id).exec();
  }

  async updateUserStatus(id: string, status: 'active' | 'blocked'): Promise<User | null> {
    const userDocument = await UserModel.findByIdAndUpdate(id, { isActive: status }, { new: true }).exec();
    return userDocument ? this.toDomain(userDocument) : null;
  }

  async findAllUsers(): Promise<User[]> {
    const userDocuments = await UserModel.find().exec();
    return userDocuments.map(this.toDomain);
  }

  private toDomain(userDocument: IUserDocument): User {
    return new User(
      userDocument._id.toString(),
      userDocument.firstName,
      userDocument.lastName,
      userDocument.cpf,
      userDocument.phone,
      userDocument.email,
      userDocument.password,
      userDocument.isActive,
      userDocument.role,
      userDocument.createdAt,
      userDocument.updatedAt,
      userDocument.createdBy,
      userDocument.updatedBy,
      userDocument.foto
    );
  }
}
