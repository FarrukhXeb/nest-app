import { User } from 'src/users/entities/user.entity';

export type JwtPayloadType = {
  id: User['id'];
  iat: number;
  exp: number;
};
