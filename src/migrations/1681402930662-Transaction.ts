import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transaction1681402930662 implements MigrationInterface {
  name = 'Transaction1681402930662';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "amount_settled" TO "watchlist_comment"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transfers_type_enum" AS ENUM('mobile-money', 'bank')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."transfers_status_enum" AS ENUM('failed', 'success')`,
    );
    await queryRunner.query(
      `CREATE TABLE "transfers" ("id" SERIAL NOT NULL, "transaction_id" integer NOT NULL, "amount" double precision NOT NULL, "account_name" character varying, "account_number" character varying, "mobile_no" character varying, "type" "public"."transfers_type_enum" NOT NULL, "status" "public"."transfers_status_enum" NOT NULL, "account_provider" character varying NOT NULL, "narration" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "transfers" ADD CONSTRAINT "FK_6a909992251fdc3b8f0ee840eb3" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfers" DROP CONSTRAINT "FK_6a909992251fdc3b8f0ee840eb3"`,
    );
    await queryRunner.query(`DROP TABLE "transfers"`);
    await queryRunner.query(`DROP TYPE "public"."transfers_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."transfers_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "watchlist_comment" TO "amount_settled"`,
    );
  }
}
