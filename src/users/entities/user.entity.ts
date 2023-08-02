import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Token } from 'src/token/entities/token.entity';
import { Role } from 'src/roles/entities/role.entity';
import { Poll } from 'src/polls/entities/poll.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: String, unique: true })
  email: string;

  @Column({ type: String })
  password: string;

  @Column({ type: String })
  firstName: string;

  @Column({ type: String, nullable: true })
  lastName?: string | null;

  @Column({ type: String, nullable: true })
  profileImage?: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Token, (Token) => Token.user)
  tokens?: Token[];

  @ManyToOne(() => Role, {
    eager: true,
  })
  role?: Role | null;

  @ManyToMany(() => Poll, (poll) => poll.participants)
  @JoinTable()
  polls?: Poll[];

  @OneToMany(() => Poll, (poll) => poll.user, { nullable: true })
  createdPolls?: Poll[];

  @BeforeInsert()
  @BeforeUpdate()
  async setPassword?() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
