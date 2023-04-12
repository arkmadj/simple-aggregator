import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1681317399055 implements MigrationInterface {
    name = 'Transaction1681317399055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transactions_settlement_currency_enum" AS ENUM('usd', 'ngn', 'gbp')`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_transaction_status_enum" AS ENUM('success', 'failed')`);
        await queryRunner.query(`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "pin" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "settlement_currency" "public"."transactions_settlement_currency_enum" NOT NULL, "amount" double precision NOT NULL, "amount_revised" double precision NOT NULL, "fees" double precision NOT NULL, "sub_total" double precision NOT NULL, "amount_destination" double precision NOT NULL, "transaction_status" "public"."transactions_transaction_status_enum" NOT NULL, "completed_date" TIMESTAMP NOT NULL, "paid_by" character varying NOT NULL, "amount_settled" text NOT NULL DEFAULT 'no', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transactions"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_settlement_currency_enum"`);
    }

}
