import { Controller, Get, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "./prisma/prisma.service";

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHello() {
    return {
      name: "MangaNarrator AI API core Service",
      status: "running",
      version: "1.0.0",
    };
  }

  @Get("health")
  async getHealth() {
    try {
      // Execute a quick database check
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        success: true,
        status: "OK",
        services: {
          database: "Healthy",
          api: "Healthy",
        },
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      throw new HttpException(
        {
          success: false,
          status: "DEGRADED",
          services: {
            database: "Unreachable",
            api: "Healthy",
          },
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }
}
