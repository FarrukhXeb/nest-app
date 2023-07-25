import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TokenType } from '../token-type.enum';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tokens, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: String })
  token: string;

  @Column({ type: 'enum', enum: TokenType })
  type: TokenType;
}
