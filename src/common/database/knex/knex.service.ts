import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Knex  from "knex";

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy{
    private _knex: Knex;

    async onModuleInit() {
        this._knex = Knex(config)
        await this._knex
        .raw('select 1')
            .then(() => {
            Logger.log(`Knex: Connected to database - OK`)
            })
            .catch(err => {
            Logger.error(`Knex: Failed to connect to database: ${err}`)
            process.exit(1)
            })
        // throw new Error('Method not implemented.');
    }
    async onModuleDestroy() {
        await this._knex.destroy()
        Logger.log("Knex: Disconnected from database")
        // throw new Error('Method not implemented.');
    }

    knex(){
        return this._knex;
    }
}

const config:Knex.Config = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
}
