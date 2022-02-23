import { User } from '~/domains/User';

export interface IUserRepository {
  findOne(pages: Partial<User>): Promise<User | null>;
  update(userId: string, newObject: Partial<User>): Promise<User | null>;
}
