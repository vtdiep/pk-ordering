/* eslint-disable no-plusplus */

// eslint-disable-next-line import/no-extraneous-dependencies
import { produce } from 'immer';
import { Category } from 'src/category/entities/category.entity';

const baseCategoryFixture: Category = {
  category_id: 0,

  name: `Category 1`,

  description: `Category 1`,

  active: true,

  private_note: ``,
};

export class CategoryFixture {
  private static counter: number = 0;

  /**
 * 
 * @param partial 
 * @returns Modified version of the base Category data fixture, w/ autoincrementing counter w/ each call
 * @default {
  category_id: 0,

  name: `Category ${CategoryFixture.counter}`,

  description: `Category ${CategoryFixture.counter}`,

  active: true,

  private_note:`` 
};
 */
  static makeStruct(partial?: Partial<Category>) {
    this.counter += 1;

    if (!partial) {
      return produce(baseCategoryFixture, (draft) => {
        // eslint-disable-next-line no-param-reassign
        draft.name = `Category ${CategoryFixture.counter}`;
        // eslint-disable-next-line no-param-reassign
        draft.description = `Category ${CategoryFixture.counter}`;
      });
    }

    return produce(baseCategoryFixture, (draft) => {
      // eslint-disable-next-line no-param-reassign

      Object.entries(partial).forEach(([k, v]) => {
        // eslint-disable-next-line no-param-reassign
        draft[k] = v;
      });
      if (!partial.name) {
        // eslint-disable-next-line no-param-reassign
        draft.name = `Category ${CategoryFixture.counter}`;
      }

      if (!partial.description) {
        // eslint-disable-next-line no-param-reassign
        draft.description = `Category ${CategoryFixture.counter}`;
      }
    });
  }
}
