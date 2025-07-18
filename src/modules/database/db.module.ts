import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Models } from "src/models";

// DATABSE KEYS FROM .ENV FILE -->
const { DATABASE, DB_USERNAME, PASSWORD, HOST, DBPORT, MAXIMUM_RETRY_COUNT, RETRY_TIMEOUT } = process.env;

// NEST JS MODULE TO INTIALIZE MYSQL AND MODELS
@Module({
    imports: [
        // SEQELIZE MODULE TO STABILIZE CONNECTION WITH MYSQL AND MODELS 
        SequelizeModule.forRoot({
            dialect: 'mysql',
            host: HOST,
            port: Number(DBPORT),
            username: DB_USERNAME,
            password: PASSWORD,
            database: DATABASE,
            retry: {
                max: Number(MAXIMUM_RETRY_COUNT),
                timeout: Number(RETRY_TIMEOUT)
            },
            logging: false,
            autoLoadModels: true,
            synchronize: true,
            models: Models,
            sync: { alter: true }
        })
    ],
    exports: [SequelizeModule]
})

export class DatabaseModule { }