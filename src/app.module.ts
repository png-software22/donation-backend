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
import { UserController } from './controller/user.controller';
import { UserService } from './services/user.service';
import { User } from './models/user.model';

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
        models: [City, State,User],
      }),
      inject: [ConfigService],
    }),

    SequelizeModule.forFeature([City, State, User]), // what is purpose of this line
  ],
  controllers: [AppController, StateController, CityController, UserController],
  providers: [AppService, StateService, CityService, UserService]
})
export class AppModule {}
