import { Body, JsonController, Param, Post, Put, UseBefore } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { IUser } from '../interfaces/user';
import { UserService } from '../services/user';
import { UpdateByUserPolicy } from '../policies/updateByUser.policy';

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

  @Put('/update/:id')
  @UseBefore(UpdateByUserPolicy)
  public async updateByUser(@Param('id') id: string, @Body() body: Partial<IUser>) {
    return this.userService.updateByUser(id, body);
  }
}
