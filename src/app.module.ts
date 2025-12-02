import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './models/city.model';
import { State } from './models/state.model';
import { Sequelize } from 'sequelize-typescript';

@Module({
  imports: [
    SequelizeModule.forFeature([City, State]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME ?? 'gursimran',
      password: process.env.POSTGRES_PASSWORD ?? 'root',
      database: process.env.POSTGRES_DB_NAME ?? 'donations',
      synchronize: true,
      autoLoadModels: true,
      models: [City, State],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
