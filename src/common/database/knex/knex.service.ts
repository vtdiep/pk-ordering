import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Knex  from "knex";

@Injectable()
export class KnexService implements OnModuleInit, OnModuleDestroy{
    private _knex: Knex;
    constructor(){
    }

    async onModuleInit() {
        this._knex = Knex(config)
        try {
            await this._knex.raw('select 1')
        } catch (error) {
            Logger.error(`Knex: Failed to connect to database; closing program...`)
            process.exit(1)
        }
        Logger.log(`Knex: Connected to database - OK`)

    }
    async onModuleDestroy() {
        await this._knex.destroy()
        Logger.log("Knex: Disconnected from database")
        // throw new Error('Method not implemented.');
    }

    get_knex(){
        if(!this._knex){
            this._knex = Knex(config)
        }
        return this._knex
    }
}

const config:Knex.Config = {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    searchPath: ['knex', 'public'],
}
