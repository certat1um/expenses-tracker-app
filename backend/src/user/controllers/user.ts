import { Body, JsonController, Post } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUser } from '../interfaces/user';
import { UserService } from '../services/user';

@Service()
@JsonController('/users')
export class UserController {
  @Inject() private userService: UserService;

  @Post('/login')
  public async login(@Body() body: Pick<IUser, 'email' | 'password'>) {
    return this.userService.login(body);
  }

  @Post('/register')
  public async register(@Body() body: IUser) {
    return this.userService.register(body);
  }
}
