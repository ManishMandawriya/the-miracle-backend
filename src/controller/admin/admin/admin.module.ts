import { Module } from '@nestjs/common';
import { Admin } from 'src/models/index.entity';

@Module({
    imports:[Admin]
})
export class AdminModule {}
