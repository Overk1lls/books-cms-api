import { MigrationInterface, QueryRunner } from 'typeorm';

export class Indexes1745245434363 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE INDEX idx_books_title ON books (title);');
    await queryRunner.query('CREATE INDEX idx_books_author ON books (author);');
    await queryRunner.query(
      'CREATE INDEX idx_books_publication_date ON books (publication_date);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS idx_books_title;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_books_author;');
    await queryRunner.query('DROP INDEX IF EXISTS idx_books_publication_date;');
  }
}
