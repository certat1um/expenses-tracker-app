import { Inject, Service } from 'typedi';
import { IUser } from '../interfaces/user';
import { UserRepository } from '../repositories/user';
import { BadRequestError, UnauthorizedError } from 'routing-controllers';
import { AuthService } from '../../auth/services/auth';

@Service()
export class UserService {
  @Inject() private userRepository: UserRepository;
  @Inject() private authService: AuthService;

  public async login(
    data: Pick<IUser, 'email' | 'password'>,
  ): Promise<{ token: string }> {
    const foundUser = await this.userRepository.findBy({ email: data.email });
    if (!foundUser) {
      throw new BadRequestError('Invalid user data.');
    }

    // check user password
    const isSuccess = await this.authService.passCheck(
      data.password,
      foundUser.password,
    );
    if (!isSuccess) {
      throw new UnauthorizedError('Invalid user password');
    }

    // generate user accessToken
    const token = this.authService.signJwt({ id: foundUser.id });

    return { token };
  }

  public async register(data: IUser): Promise<{ token: string }> {
    const isExist = await this.userRepository.findBy({ email: data.email });
    if (isExist) {
      throw new BadRequestError('User with this data already registered.');
    }

    // crypt user password
    const cryptedPass = await this.authService.passEncrypt(data.password);
    const createdUser = await this.userRepository.create({
      ...data,
      password: cryptedPass,
    });

    // generate user accessToken
    const token = this.authService.signJwt({ id: createdUser.id });

    return { token };
  }
}
