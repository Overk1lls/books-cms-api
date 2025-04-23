import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublicationDate1745251095068 implements MigrationInterface {
  name = 'PublicationDate1745251095068';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" RENAME COLUMN "publicationDate" TO "publication_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" DROP COLUMN "publication_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD "publication_date" TIMESTAMP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "books" DROP COLUMN "publication_date"`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" ADD "publication_date" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "books" RENAME COLUMN "publication_date" TO "publicationDate"`,
    );
  }
}
