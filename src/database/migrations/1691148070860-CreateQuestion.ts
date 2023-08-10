import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateQuestion1691148070860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE "question_type_enum" AS ENUM('TEXT', 'MULTIPLE_CHOICE', 'CHECKBOX', 'DROPDOWN');
        CREATE TABLE "question" (
            "id" SERIAL NOT NULL,
            "text" text NOT NULL,
            "type" question_type_enum NOT NULL DEFAULT 'TEXT',
            "pollId" integer,
            CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"),
            CONSTRAINT "FK_91e0701bef5000bf6bc11e50ff2" FOREIGN KEY ("pollId") REFERENCES "poll"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        );

        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite color?', 'TEXT', 1);
        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite programming language?', 'MULTIPLE_CHOICE', 1);
        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite food?', 'CHECKBOX', 1);
        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite drink?', 'DROPDOWN', 1);
        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite color?', 'TEXT', 2);
        INSERT INTO "question" ("text", "type", "pollId") VALUES ('What is your favorite programming language?', 'MULTIPLE_CHOICE', 2);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE "question";
        DROP TYPE "question_type_enum";
    `);
  }
}
