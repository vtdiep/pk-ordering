import { Module } from '@nestjs/common';
import { KnexService } from './knex.service';

@Module({
    imports: [],
    controllers: [],
    providers: [{provide:'Knex', useFactory: async knexService => {
        let k =  new KnexService();
        let l = await k.get_knex()
        return l
      },
    }],
    exports: ['Knex']
})
export class KnexModule {}
