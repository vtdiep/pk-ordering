/* eslint-disable no-plusplus */

// eslint-disable-next-line import/no-extraneous-dependencies
import { produce } from 'immer';
import { Menu } from 'src/menu/entities/menu.entity';

/**
 * @typedef {Object} Menu
 * @property {string} name
 * @property {boolean} active
 */

const baseMenuFixture: Menu = {
  name: `Menu 0`,

  display_order: 1,

  active: true,

  description: `Menu 0`,

  private_note: 'Todo: Prixe fixe',
};

export class MenuFixture {
  private static counter: number = 0;

  /**
 * 
 * @param partial 
 * @returns Modified version of the base Menu data fixture, w/ autoincrementing counter w/ each call
 * @default {
    name: `Menu ${MenuFixture.counter}`,
    display_order: 1,
    active: true,
    description:`Menu ${MenuFixture.counter}`,
    private_note: 'Todo: Prixe fixe',
  } 
 */
  static makeStruct(partial?: Partial<Menu> & Pick<Menu, 'display_order'>) {
    this.counter += 1;

    if (!partial) {
      return produce(baseMenuFixture, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft.name = `Menu ${MenuFixture.counter}`;
        // eslint-disable-next-line no-param-reassign
        draft.description = `Menu ${MenuFixture.counter}`;
      });
    }

    return produce(baseMenuFixture, (draft) => {
      // eslint-disable-next-line no-param-reassign

      Object.entries(partial).forEach(([k, v]) => {
        // eslint-disable-next-line no-param-reassign
        draft[k] = v;
      });
      if (!partial.name) {
        // eslint-disable-next-line no-param-reassign
        draft.name = `Menu ${MenuFixture.counter}`;
      }

      if (!partial.description) {
        // eslint-disable-next-line no-param-reassign
        draft.description = `Menu ${MenuFixture.counter}`;
      }
    });
  }
}
