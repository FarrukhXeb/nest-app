import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateToken1691135127257 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TYPE token_type_enum AS ENUM('access', 'refresh', 'resetPassword', 'verifyEmail');

        CREATE TABLE "token" (
            "id" SERIAL NOT NULL,
            "token" character varying NOT NULL,
            "type" token_type_enum NOT NULL,
            "userId" integer,
            CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
            CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('token');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('token', foreignKey);
    }
    await queryRunner.query(`DROP type token_type_enum`);
    await queryRunner.query(`DROP TABLE token`);
  }
}
