import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger("PrismaService");

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log("Successfully connected to PostgreSQL database.");
    } catch (err) {
      this.logger.error("Failed to connect to database:", err);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log("Prisma client disconnected.");
  }
}
