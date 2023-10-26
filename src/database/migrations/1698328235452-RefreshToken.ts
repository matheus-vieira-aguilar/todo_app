import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class RefreshToken1698328235452 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "refresh_tokens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "expiresIn",
            type: "varchar",            
          },
          {
            name: "userId",
            type: "uuid"
          }
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("refresh_tokens");
  }
}
