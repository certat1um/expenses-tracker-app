import * as jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { envConfig } from '../../config/envConfig';
import bcrypt from 'bcrypt';

const { JWT_SECRET_TOKEN } = envConfig;

@Service()
export class AuthService {
  public async passEncrypt(value: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(value, salt);
  }

  public async passCheck(plainValue: string, encrypted: string): Promise<boolean> {
    return await bcrypt.compare(plainValue, encrypted);
  }

  public signJwt(payload: { [key: string]: string }): string {
    return jwt.sign(payload, JWT_SECRET_TOKEN as string, {
      expiresIn: '1h',
    });
  }

  public getJwtPayload(token: string): jwt.JwtPayload {
    return jwt.decode(token) as jwt.JwtPayload;
  }
}
