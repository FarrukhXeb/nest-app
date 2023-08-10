import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserPoll1691145850764 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "user_polls_poll" (
            "userId" integer NOT NULL,
            "pollId" integer NOT NULL,
            CONSTRAINT "FK_9f8fd2dd2d001511526c88860d1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT "FK_119e9b5e1a0f61c3800eeebc196" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "PK_47f35a7f4f66631ec4bd95ceabd" PRIMARY KEY ("userId", "pollId")
        );

        CREATE INDEX "IDX_9f8fd2dd2d001511526c88860d" ON "user_polls_poll" ("userId");
        CREATE INDEX "IDX_119e9b5e1a0f61c3800eeebc19" ON "user_polls_poll" ("pollId");

        INSERT INTO "user_polls_poll" ("userId", "pollId") VALUES (1, 1);
        INSERT INTO "user_polls_poll" ("userId", "pollId") VALUES (2, 1);
        INSERT INTO "user_polls_poll" ("userId", "pollId") VALUES (3, 1);
        INSERT INTO "user_polls_poll" ("userId", "pollId") VALUES (4, 1);
    `);

    const promises = [];

    const randomUser = () => Math.floor(Math.random() * 100) + 1;
    const randomPoll = () => Math.floor(Math.random() * 200) + 1;

    for (let i = 1; i <= 4; i++) {
      promises.push(
        queryRunner.query(`
        INSERT INTO "user_polls_poll" ("userId", "pollId") VALUES (${randomUser()}, ${randomPoll()});
      `),
      );
    }
    await Promise.all(promises);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_polls_poll');
  }
}
