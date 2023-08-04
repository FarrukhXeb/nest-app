import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Role1690437022644 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "role" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(
      `INSERT INTO role (name) VALUES  ('admin'), ('user')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role');
  }
}
