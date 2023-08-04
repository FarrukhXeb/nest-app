import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOption1691148474172 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "option" (
            "id" SERIAL NOT NULL,
            "text" text NOT NULL,
            "questionId" integer,
            CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"),
            CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        );
        INSERT INTO "option" ("text", "questionId") VALUES ('Red', 1);
        INSERT INTO "option" ("text", "questionId") VALUES ('Blue', 1);
        INSERT INTO "option" ("text", "questionId") VALUES ('Green', 1);
        INSERT INTO "option" ("text", "questionId") VALUES ('Yellow', 1);
        INSERT INTO "option" ("text", "questionId") VALUES ('C++', 2);
        INSERT INTO "option" ("text", "questionId") VALUES ('Java', 2);
        INSERT INTO "option" ("text", "questionId") VALUES ('JavaScript', 2);
        INSERT INTO "option" ("text", "questionId") VALUES ('Python', 2);
        INSERT INTO "option" ("text", "questionId") VALUES ('Pizza', 3);
        INSERT INTO "option" ("text", "questionId") VALUES ('Hamburger', 3);
        INSERT INTO "option" ("text", "questionId") VALUES ('Hot Dog', 3);
        INSERT INTO "option" ("text", "questionId") VALUES ('Sushi', 3);
        INSERT INTO "option" ("text", "questionId") VALUES ('Water', 4);
        INSERT INTO "option" ("text", "questionId") VALUES ('Soda', 4);
        INSERT INTO "option" ("text", "questionId") VALUES ('Beer', 4);
        INSERT INTO "option" ("text", "questionId") VALUES ('Wine', 4);
        INSERT INTO "option" ("text", "questionId") VALUES ('Red', 5);
        INSERT INTO "option" ("text", "questionId") VALUES ('Blue', 5);
        INSERT INTO "option" ("text", "questionId") VALUES ('Green', 5);
        INSERT INTO "option" ("text", "questionId") VALUES ('Yellow', 5);
        INSERT INTO "option" ("text", "questionId") VALUES ('C++', 6);
        INSERT INTO "option" ("text", "questionId") VALUES ('Java', 6);
        INSERT INTO "option" ("text", "questionId") VALUES ('JavaScript', 6);
        INSERT INTO "option" ("text", "questionId") VALUES ('Python', 6);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "option";`);
  }
}
