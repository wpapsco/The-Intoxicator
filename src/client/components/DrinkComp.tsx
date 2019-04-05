import * as React from "react";
import { Drink, DrinkRecipe, Ingredients } from "../../drinks";
import { save } from "../server";
import Button from '@material-ui/core/Button';
import { Card, CardContent, CardActions, Typography, withStyles, StyleRulesCallback, CardMedia } from "@material-ui/core";

interface Props {
    drink: Drink,
    ingredients: Ingredients,
    classes?: any
}

const styles: StyleRulesCallback = theme => ({
    card: {
        height: "100%",
    },
});

const recipe = (drink: Drink, ingredients: Ingredients) => {
    return Object.getOwnPropertyNames(drink.recipe).map(e =>
        `${drink.recipe[e]} part${drink.recipe[e] == 1 ? "" : "s"} ${ingredients[e].name}`)
        .join(", ")
}

const capitalize = (s: string) => {
    return s[0].toUpperCase() + s.slice(1)
}

class DrinkComp extends React.Component<Props> {
    onClick = () => {
        save<DrinkRecipe>("drink", this.props.drink.recipe);
    }

    render() {
        return <Card className={this.props.classes.card} style={{ background: this.props.drink.color || "#616161" }}>
            <CardMedia
                style={{ height: 0, paddingTop: '100%' }}
                image={this.props.drink.image || "/default.png"}
                title={this.props.drink.name} />
            <CardContent>
                <Typography variant="title">{capitalize(this.props.drink.name)}</Typography>
                <Typography variant="body1">{recipe(this.props.drink, this.props.ingredients)}</Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    onClick={this.onClick}>
                    Make
                </Button>
            </CardActions>
        </Card>

    }
}

export default withStyles(styles)(DrinkComp);