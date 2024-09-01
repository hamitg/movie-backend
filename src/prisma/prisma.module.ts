import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaService } from './prisma.service';
@Global()
@Module({
  imports: [
    PrismaModule.forRootAsync({
      isGlobal: true,
      useClass: PrismaService,
    }),
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModules {}
