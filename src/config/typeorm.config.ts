import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeormConfig:TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '1591uk@$',
    database: 'blog',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
};