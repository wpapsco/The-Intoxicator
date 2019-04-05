import { Request, Response } from "express"
import { DrinkRecipe, Ingredients, Drinks } from "./drinks";

export interface TestData {
    some: string
}

export interface Request<T> extends Request {
    sendDrink: (drink: DrinkRecipe) => boolean;
    ingredients: Ingredients;
    drinks: Drinks;
    body: T;
}

export interface Response<T> extends Response {
    send: (body: T) => Response
}