import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUser1690437234031 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'identity',
          },
          {
            name: 'email',
            type: 'varchar(255)',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar(255)',
          },
          {
            name: 'firstName',
            type: 'varchar(255)',
          },
          {
            name: 'lastName',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'profileImage',
            type: 'varchar(255)',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'date',
            default: 'now()',
          },
          {
            name: 'roleId',
            type: 'int',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'user',
      new TableForeignKey({
        columnNames: ['roleId'],
        referencedTableName: 'role',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraint from "user" table
    const table = await queryRunner.getTable('user');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('roleId') !== -1,
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('user', foreignKey);
    }
    await queryRunner.dropTable('user');
  }
}
