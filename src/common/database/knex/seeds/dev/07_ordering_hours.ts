import { DAY_OF_WEEK } from '@prisma/client';
import { Knex } from 'knex';

type Schedule = {
  day_of_week: DAY_OF_WEEK;
  open_time: string;
  close_time: string;
};

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex.raw('TRUNCATE TABLE "ordering_hours" RESTART IDENTITY CASCADE');

  let schedule: Schedule[] = [
    { day_of_week: 'MONDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'TUESDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'WEDNESDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'THURSDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'FRIDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'SATURDAY', open_time: '11:00', close_time: '20:00' },
    { day_of_week: 'SUNDAY', open_time: '11:00', close_time: '20:00' },
  ];
  await knex<Schedule>('ordering_hours').insert(schedule);
}
