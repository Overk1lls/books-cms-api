import { MigrationInterface, QueryRunner } from 'typeorm';

export class Indices1745251315636 implements MigrationInterface {
  name = 'Indices1745251315636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX "IDX_3cd818eaf734a9d8814843f119" ON "books" ("title") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "books" ("author") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_092ad7763d9579e4fa36ba1777" ON "books" ("publication_date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_092ad7763d9579e4fa36ba1777"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4675aad2c57a7a793d26afbae9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3cd818eaf734a9d8814843f119"`,
    );
  }
}
