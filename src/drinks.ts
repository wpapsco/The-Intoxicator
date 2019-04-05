export interface Ingredient { name: string, pump: number }

export type BaseIngredients = { [K in keyof typeof ingredients]: Ingredient }

export type Ingredients = { [name: string]: Ingredient }

export const ingredients = {
    rum: {
        name: "rum",
        pump: 0
    },
    coke: {
        name: "coke",
        pump: 1
    },
    gin: {
        name: "gin",
        pump: 2
    },
    juice: {
        name: "juice",
        pump: 3
    },
    vodka: {
        name: "vodka",
        pump: 4
    },
    lemonLime: {
        name: "lemon lime",
        pump: 5
    },
    cream: {
        name: "cream",
        pump: 6
    },
    coffeeliquor: {
        name: "khalua",
        pump: 7
    }
}

export type Drinks = { [drink: string]: Drink }

export const drinks: Drinks = {
    ginAndJuice: {
        name: "gin and juice",
        image: "/ginandjuice.jpg",
        color: "#1b5e20",
        recipe: {
            gin: 1,
            juice: 1,
        }
    },
    rumAndCoke: {
        name: "rum and coke",
        color: "#3e2723",
        image: "/rumandcoke.jpg",
        recipe: {
            rum: 1,
            coke: 1,
        }
    },
    vodkaSour: {
        name: "vodka sour",
        image: "/vodkasour.jpg",
        color: "#827717",
        recipe: {
            vodka: 1,
            lemonLime: 1,
        }
    },
    whiteRussan: {
        name: "white russian",
        color: "#795548",
        image: "/whiterussian.jpg",
        recipe: {
            vodka: 1,
            coffeeliquor: 1,
            cream: 2
        }
    }
}

const toRatios = (drink: DrinkRecipe) => {
    const sum = Object.getOwnPropertyNames(drink).reduce((acc, c) => acc + drink[c], 0)
    return Object.getOwnPropertyNames(drink).reduce((acc, c) => {
        if (drink[c] > 0) {
            acc[c] = drink[c] / sum;
        }
        return acc;
    }, {})
}

const toBytesFromRatio = (drink: DrinkRecipe, ingredients: Ingredients) => {
    const ings = Object.getOwnPropertyNames(drink)
    const arr = ings.reduce((acc, c) => {
        acc.push(ingredients[c].pump, Math.round(drink[c] * 255));
        return acc;
    }, [])
    return new Buffer(arr);
}

export interface Drink {
    name: string,
    recipe: DrinkRecipe,
    color?: string,
    image?: string
}

export type DrinkRecipe = {
    [K in keyof typeof ingredients]?: number
}

export const toBytes = (drink: DrinkRecipe) => {
    return toBytesFromRatio(toRatios(drink), ingredients)
}