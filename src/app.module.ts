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
import { DonationService } from './services/donation.service';
import { DonationController } from './controller/donation.controller';
import { Donation } from './models/donation.model';
import { Expense } from './models/expense.model';
import { ExpenseController } from './controller/expense.controller';
import { ExpenseService } from './services/expense.service';


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
        models: [City, State, Donor,Donation,Expense],
      }),
      inject: [ConfigService],
    }),

    SequelizeModule.forFeature([City, State, Donor,Donation,Expense]), // what is purpose of this line
  ],
  controllers: [
    AppController,
    StateController,
    CityController,
    DonorController,
    DonationController,
    ExpenseController
  ],
  providers: [AppService, StateService, CityService, DonorService,DonationService, ExpenseService],
})
export class AppModule {}
