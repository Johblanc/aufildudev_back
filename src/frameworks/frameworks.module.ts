import { Module } from '@nestjs/common';
import { FrameworksService } from './frameworks.service';
import { FrameworksController } from './frameworks.controller';

@Module({
  controllers: [FrameworksController],
  providers: [FrameworksService]
})
export class FrameworksModule {}
