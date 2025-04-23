import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthorsBiography1745346099307 implements MigrationInterface {
  name = 'AuthorsBiography1745346099307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "authors" ADD "biography" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "authors" DROP COLUMN "biography"`);
  }
}
