import { faker } from '@faker-js/faker';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePoll1691130203432 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create Poll table and add some data
    await queryRunner.query(`
      CREATE TABLE "poll" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "startDate" TIMESTAMP DEFAULT now(),
        "endDate" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer,
        CONSTRAINT "PK_03b5cf19a7f562b231c3458527e" PRIMARY KEY ("id"),
        CONSTRAINT "FK_0610ebcfcfb4a18441a9bcdab2f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
      CREATE INDEX "IDX_0610ebcfcfb4a18441a9bcdab2" ON "poll" ("title");
      CREATE INDEX "IDX_0610ebcfcfb4a18441a9bcdab2f" ON "poll" ("userId");
    `);
    const users = await queryRunner.query(`
        SELECT id FROM "user";
    `);
    const getRandomUser = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex].id;
    };

    const promises = [];

    for (let i = 0; i < 200; i++) {
      promises.push(
        queryRunner.query(`
          INSERT INTO poll ("title", "description", "userId", "endDate")
          VALUES  ('${faker.lorem.words(3)}', '${faker.lorem.words(
          10,
        )}', ${getRandomUser()}, '2021-01-01');
        `),
      );
    }
    await Promise.all(promises);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('poll');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('poll', foreignKey);
    }
    await queryRunner.query(`DROP TABLE poll`);
  }
}
