import * as React from "react";
import { Drink, DrinkRecipe, Ingredients, } from "../../drinks";
import { withStyles, StyleRulesCallback, Select, MenuItem, TextField, Grid, Button, InputLabel, FormControl, Typography, } from "@material-ui/core";
import { save } from "../server";

interface Props {
    classes?: any,
    ingredients: Ingredients,
    onSubmit: () => void
}

interface State {
    selected: string,
    selectedValue: number,
    drink: DrinkRecipe,
    name: string
}

const styles: StyleRulesCallback = theme => ({
    // formControl: {
    //     minWidth: 100,
    // }
});

const recipe = (drink: DrinkRecipe, ingredients: Ingredients) => {
    return Object.getOwnPropertyNames(drink)
        .filter(e => drink[e] > 0)
        .map(e => `${drink[e]} part${drink[e] == 1 ? "" : "s"} ${ingredients[e].name}`)
        .join(", ")
}

const capitalize = (s: string) => {
    return s[0].toUpperCase() + s.slice(1)
}

class DrinkMaker extends React.Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            selectedValue: 0,
            drink: {},
            name: ""
        }
    }

    handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selected: e.target.value
        })
    }

    handlePartsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = 0;
        if (!isNaN(e.target.valueAsNumber) && e.target.valueAsNumber >= 0) {
            value = Math.floor(e.target.valueAsNumber);
        }
        this.setState({
            selectedValue: value
        });
    }

    handleAdd = () => {
        if (this.state.selected === "") {
            return;
        }
        this.setState({
            drink: {
                ...this.state.drink,
                [this.state.selected]: this.state.selectedValue
            },
            selected: "",
            selectedValue: 0
        })
    }

    handleMake = () => {
        save<Drink>("customdrink", { name: this.state.name, recipe: this.state.drink })
            .then(this.props.onSubmit);
        this.setState({
            drink: {},
            name: ""
        })
    }

    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value
        })
    }

    render() {
        return <div>
            <Typography variant="h3" align="center">Custom drink</Typography>
            <Grid container spacing={8}>
                <Grid container item spacing={8} xs={12} md={6} alignItems="flex-end">
                    <Grid item xs={4} >
                        <FormControl /*className={this.props.classes.formControl}*/ fullWidth>
                            <InputLabel htmlFor="ingredient-select">Ingredient</InputLabel>
                            <Select
                                fullWidth
                                onChange={this.handleSelectionChange}
                                value={this.state.selected}
                                inputProps={{
                                    name: 'ingredient',
                                    id: 'ingredient-select',
                                }}>
                                {Object.getOwnPropertyNames(this.props.ingredients).map(e =>
                                    <MenuItem value={e} key={e}>{capitalize(this.props.ingredients[e].name)}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="Parts"
                            fullWidth
                            onChange={this.handlePartsChange}
                            value={this.state.selectedValue + ""}
                            type="number" />
                    </Grid>
                    <Grid item xs={4}>
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={this.state.selected == ""}
                            fullWidth
                            onClick={this.handleAdd}>
                            Add
                    </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Drink name"
                            value={this.state.name}
                            fullWidth
                            onChange={this.handleNameChange} />
                    </Grid>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Typography variant="h6">Your drink so far:</Typography>
                    <Typography>{recipe(this.state.drink, this.props.ingredients).length > 0 ? recipe(this.state.drink, this.props.ingredients) : "Empty!"}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={this.state.name == "" || Object.getOwnPropertyNames(this.state.drink).length == 0}
                        onClick={this.handleMake}>
                        Make
                    </Button>
                </Grid>
            </Grid>
        </div>
    }
}

export default withStyles(styles)(DrinkMaker);