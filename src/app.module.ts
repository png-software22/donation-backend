import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './models/city.model';
import { State } from './models/state.model';


import { StateController } from './controller/state.controller';
import { StateService } from './services/state.service';

import { CityController } from './controller/city.controller';
import { CityService } from './services/city.service';

@Module({
  imports: [
    SequelizeModule.forFeature([City, State]),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST ?? 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USERNAME ?? 'postgres',
      password: process.env.POSTGRES_PASSWORD ?? 'password',
      database: process.env.POSTGRES_DB_NAME ?? 'donations',
      synchronize: true,
      autoLoadModels: true,
      models: [City, State],
    }),
  ],

  
  controllers: [AppController, StateController, CityController],

  providers: [AppService, StateService, CityService],
})
export class AppModule {}
