import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTransferStatusEnum1681473220804 implements MigrationInterface {
    name = 'UpdateTransferStatusEnum1681473220804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."transactions_transaction_status_enum" RENAME TO "transactions_transaction_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_transaction_status_enum" AS ENUM('completed', 'uncompleted')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "transaction_status" TYPE "public"."transactions_transaction_status_enum" USING "transaction_status"::"text"::"public"."transactions_transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_transaction_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."transfers_status_enum" RENAME TO "transfers_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."transfers_status_enum" AS ENUM('failed', 'success', 'processing')`);
        await queryRunner.query(`ALTER TABLE "transfers" ALTER COLUMN "status" TYPE "public"."transfers_status_enum" USING "status"::"text"::"public"."transfers_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transfers_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transfers_status_enum_old" AS ENUM('failed', 'success')`);
        await queryRunner.query(`ALTER TABLE "transfers" ALTER COLUMN "status" TYPE "public"."transfers_status_enum_old" USING "status"::"text"::"public"."transfers_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transfers_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transfers_status_enum_old" RENAME TO "transfers_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."transactions_transaction_status_enum_old" AS ENUM('completed', 'uncompleted', 'processing')`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "transaction_status" TYPE "public"."transactions_transaction_status_enum_old" USING "transaction_status"::"text"::"public"."transactions_transaction_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."transactions_transaction_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."transactions_transaction_status_enum_old" RENAME TO "transactions_transaction_status_enum"`);
    }

}
