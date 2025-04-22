import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuthorsAndRelateBooks1745339867396
  implements MigrationInterface
{
  name = 'CreateAuthorsAndRelateBooks1745339867396';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4675aad2c57a7a793d26afbae9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" RENAME COLUMN "author" TO "author_id"`,
    );
    await queryRunner.query(
      `CREATE TABLE "authors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_6c64b3df09e6774438aeca7e0b0" UNIQUE ("name"), CONSTRAINT "PK_d2ed02fabd9b52847ccb85e6b88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "author_id"`);
    await queryRunner.query(`ALTER TABLE "books" ADD "author_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "books" ADD CONSTRAINT "FK_1056dbee4616479f7d562c562df" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`
        DROP TRIGGER IF EXISTS books_vector_update ON books;
      `);
    await queryRunner.query(`
        DROP INDEX IF EXISTS idx_books_search_vector;
      `);
    await queryRunner.query(`
        UPDATE books
        SET search_vector = to_tsvector('english', coalesce(title, ''));
      `);
    await queryRunner.query(`
        CREATE INDEX idx_books_search_vector ON books USING GIN (search_vector);
      `);
    await queryRunner.query(`
        CREATE TRIGGER books_vector_update
        BEFORE INSERT OR UPDATE ON books
        FOR EACH ROW
        EXECUTE FUNCTION tsvector_update_trigger(search_vector, 'pg_catalog.english', title);
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP CONSTRAINT "FK_1056dbee4616479f7d562c562df"`,
    );
    await queryRunner.query(`ALTER TABLE "books" DROP COLUMN "author_id"`);
    await queryRunner.query(
      `ALTER TABLE "books" ADD "author_id" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "authors"`);
    await queryRunner.query(
      `ALTER TABLE "books" RENAME COLUMN "author_id" TO "author"`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4675aad2c57a7a793d26afbae9" ON "books" ("author") `,
    );
    await queryRunner.query(`
            DROP TRIGGER IF EXISTS books_vector_update ON books;
          `);
    await queryRunner.query(`
            DROP INDEX IF EXISTS idx_books_search_vector;
          `);
    await queryRunner.query(`
            UPDATE books
            SET search_vector = NULL;
          `);
  }
}
