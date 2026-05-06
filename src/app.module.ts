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
        dialect: 'mysql', // Change from 'postgres' to 'mysql'
        host: config.get('MYSQL_HOST'), // Update environment variable names
        port: 3306, // Default MySQL port
        username: config.get('MYSQL_USERNAME'),
        password: config.get('MYSQL_PASSWORD'),
        database: config.get('MYSQL_DB_NAME'),
        autoLoadModels: true,
        synchronize: true,
        sync: { alter: false }, // Automatically updates tables without dropping them
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
