import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSearchVectorForGinIndex1745251952394
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE books ADD COLUMN search_vector tsvector;
          `);
    await queryRunner.query(`
            UPDATE books
            SET search_vector = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(author, ''));
          `);
    await queryRunner.query(`
            CREATE INDEX idx_books_search_vector ON books USING GIN (search_vector);
          `);
    await queryRunner.query(`
            CREATE TRIGGER books_vector_update
            BEFORE INSERT OR UPDATE ON books
            FOR EACH ROW
            EXECUTE FUNCTION tsvector_update_trigger(search_vector, 'pg_catalog.english', title, author);
          `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS books_vector_update ON books;`,
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_books_search_vector;`);
    await queryRunner.query(`ALTER TABLE books DROP COLUMN search_vector;`);
  }
}
