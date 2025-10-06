import {repository} from '@loopback/repository';
import {post, get, requestBody, param} from '@loopback/rest';
import {Users} from '../models';
import {UsersRepository} from '../repositories';

export class UserController {
  constructor(
    @repository(UsersRepository) public userRepo: UsersRepository,
  ) {}

  // Create a new user (seller or buyer)
  @post('/users')
  async createUser(@requestBody() userData: Partial<Users>) {
    if (!userData.role || !['buyer','seller'].includes(userData.role)) {
      throw new Error('Role must be either buyer or seller');
    }
    const user = await this.userRepo.create(userData as Users);
    return user;
  }

  // Get all users
  @get('/users')
  async listUsers() {
    return this.userRepo.find();
  }

  // Get user by id
  @get('/users/{id}')
  async getUser(@param.path.number('id') id: number) {
    return this.userRepo.findById(id);
  }
}
