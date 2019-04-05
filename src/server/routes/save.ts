import express = require('express');
import { TestData, Request } from "../../types";
import { DrinkRecipe, Ingredient, Drink } from '../../drinks';
import { Server } from 'socket.io';
const router = express.Router();

router.post("/drink", (req: Request<DrinkRecipe>, res) => {
    if (req.sendDrink(req.body)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
})

router.post("/customdrink", (req: Request<Drink>, res) => {
    req.drinks[req.body.name] = req.body;
    if (req.sendDrink(req.body.recipe)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(500);
    }
})

router.post("/ingredient", (req: Request<Ingredient>, res) => {
    const todelete = Object.getOwnPropertyNames(req.ingredients).find(e => req.ingredients[e].pump === req.body.pump)
    delete req.ingredients[todelete]
    req.ingredients[req.body.name] = req.body
    res.sendStatus(200);
})

export default router;