import { join } from 'path';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';

import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ItemsModule } from './items/items.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    //* Configuración asíncrona del módulo
    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [AuthModule],
      inject: [JwtService],
      useFactory: async (jwtService: JwtService) => ({
        playground: false,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        plugins: [ApolloServerPluginLandingPageLocalDefault()],
        context({req}) {
          //TODO: crear un REST API aparte para manejar esto
          // const token = req.headers.authorization?.replace('Bearer ', '');
          // if (!token) throw new Error('Token needed');
          
          // const payload = jwtService.decode(token);
          // if (!payload) throw new Error('Token not valid');

          // console.log({payload});
        }
      })
    }),

    //? Codigo que vi de un usuario en udemy para no tener que hacer otro restful api
    // GraphQLModule.forRootAsync<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => {
    //     return {
    //       playground: false,
    //       autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //       introspection: configService.getOrThrow<boolean>(
    //         'GRAPHQL_INTROSPECTION',
    //       ), // Generally false for production
    //       plugins: [ApolloServerPluginLandingPageLocalDefault()],
    //     };
    //   },
    //   inject: [ConfigService],
    // }),

    //* Configuración básica del módulo
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   playground: false,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   plugins: [ApolloServerPluginLandingPageLocalDefault()],
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true, //! Esto no deberia estar en true en produccion
      autoLoadEntities: true
    }),
    
    ItemsModule,
    
    UsersModule,
    
    AuthModule,
    
    SeedModule,
    
    CommonModule,
    
    ListsModule,
    
    ListItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
