import { Injectable } from '@nestjs/common';

import { PrismaOptionsFactory, PrismaServiceOptions } from 'nestjs-prisma';

@Injectable()
export class PrismaService implements PrismaOptionsFactory {
  constructor() {}

  createPrismaOptions(): PrismaServiceOptions | Promise<PrismaServiceOptions> {
    return {
      prismaOptions: {
        log: ['query', 'info', 'warn'],
        errorFormat: 'pretty',
        transactionOptions: {
          maxWait: 10 * 1000,
          timeout: 20 * 1000,
        },
        omit: {
          user: {
            password: true,
          },
        },
      },
    };
  }
}
