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
    `);
    const users = await queryRunner.query(`
        SELECT id FROM "user";
    `);
    const getRandomUser = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex].id;
    };
    await queryRunner.query(`
        INSERT INTO poll ("title", "description", "userId", "endDate")
        VALUES  ('Poll 1', 'Poll 1 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 2', 'Poll 2 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 3', 'Poll 3 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 4', 'Poll 4 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 5', 'Poll 5 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 6', 'Poll 6 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 7', 'Poll 7 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 8', 'Poll 8 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 9', 'Poll 9 description', ${getRandomUser()}, '2021-01-01'),
                ('Poll 10', 'Poll 10 description', ${getRandomUser()}, '2021-01-01')
    `);
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
