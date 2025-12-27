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
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { UserController } from './controller/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guards/jwt.stategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '1d' },
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
        models: [City, State, Donor, Donation, Expense, User],
      }),
      inject: [ConfigService],
    }),

    SequelizeModule.forFeature([City, State, Donor, Donation, Expense, User]), // what is purpose of this line
  ],
  controllers: [
    AppController,
    StateController,
    CityController,
    DonorController,
    DonationController,
    ExpenseController,
    UserController,
  ],
  providers: [
    AppService,
    StateService,
    CityService,
    DonorService,
    DonationService,
    ExpenseService,
    UserService,
    JwtStrategy,
  ],
})
export class AppModule {}
