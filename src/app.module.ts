import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { City } from './models/city.model';
import { State } from './models/state.model';
import { AppController } from './app.controller';
import { StateController } from './controller/state.controller';
import { CityController } from './controller/city.controller';
import { AppService } from './app.service';
import { StateService } from './services/state.service';
import { CityService } from './services/city.service';
import { DonorController } from './controller/donor.controller';
import { DonorService } from './services/donor.service';
import { Donor } from './models/donor.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        dialect: 'postgres',
        host: config.get('POSTGRES_HOST'),
        port: 5432,
        username: config.get('POSTGRES_USERNAME'),
        password: config.get('POSTGRES_PASSWORD'),
        database: config.get('POSTGRES_DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        models: [City, State, Donor],
      }),
      inject: [ConfigService],
    }),

    SequelizeModule.forFeature([City, State, Donor]), // what is purpose of this line
  ],
  controllers: [
    AppController,
    StateController,
    CityController,
    DonorController,
  ],
  providers: [AppService, StateService, CityService, DonorService],
})
export class AppModule {}
