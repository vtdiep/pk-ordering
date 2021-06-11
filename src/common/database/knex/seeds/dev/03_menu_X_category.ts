import { category, menu, menu_X_category } from ".prisma/client";
import * as Knex from "knex";

/**
 * Seed for menu_X_category table
 */
export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw('TRUNCATE TABLE "menu_X_category" RESTART IDENTITY CASCADE')

    let breakfastId = (await knex<menu>("menu").select("menu_id").where("name", "=", "Breakfast").first()).menu_id
    
    
    let categories = await knex<category>("category").select(["category_id", "name"])

    let display_counter = 1

    // Inserts seed entries
    await knex<menu_X_category>("menu_X_category").insert([
        { menu_id_menu: breakfastId, category_id_category: categories.find(x=>x.name == "Omelettes").category_id, display_order: display_counter++},
        { menu_id_menu: breakfastId, category_id_category: categories.find(x=>x.name == "Pancakes").category_id, display_order: display_counter++},
        { menu_id_menu: breakfastId, category_id_category: categories.find(x=>x.name == "Eggs").category_id, display_order: display_counter++}
    ]);
};
