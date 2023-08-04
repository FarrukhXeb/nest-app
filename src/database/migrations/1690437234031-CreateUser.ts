import { faker } from '@faker-js/faker';
import { hash } from 'bcryptjs';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUser1690437234031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id" SERIAL NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "firstName" character varying NOT NULL,
        "lastName" character varying,
        "profileImage" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "roleId" integer,
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"),
        CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
      );
    `);
    const password = await hash('testing1234', 12);
    await queryRunner.query(`
      INSERT INTO "user" ("email", "password", "firstName", "roleId")
      VALUES
        ('admin@example.com', '${password}', 'Super Admin', 1),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2),
        ('${faker.internet.email()}', '${password}', '${faker.person.firstName()}', 2)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint from "user" table
    const table = await queryRunner.getTable('user');
    console.log(table);
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('roleId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('user', foreignKey);
    }
    await queryRunner.dropTable('user');
  }
}
