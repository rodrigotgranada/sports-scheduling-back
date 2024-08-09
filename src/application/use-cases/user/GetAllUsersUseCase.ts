import { IUserRepository } from 'src/domain/repositories/IUserRepository';
import { User } from 'src/domain/entities/User';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAllUsers();
  }
}
