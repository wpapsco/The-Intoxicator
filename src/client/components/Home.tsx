import * as React from "react";
import DrinkComp from "./DrinkComp";
import { DrinkRecipe, Ingredients, Ingredient, Drinks, ingredients } from "../../drinks";
import { save, get } from "../server";
import { MuiThemeProvider, createMuiTheme, Paper, CssBaseline, withStyles, StyleRulesCallback, Typography, TextField, Button, withWidth } from "@material-ui/core";
import Grid from '@material-ui/core/Grid';
import { pink } from "@material-ui/core/colors";
import DrinkMaker from "./DrinkMaker";
import { TypographyProps } from "@material-ui/core/Typography";
import io = require("socket.io-client")

interface State {
    ingredients?: Ingredients,
    loading: boolean,
    pumpValue: number,
    name: string,
    drinks?: Drinks
}

const theme = createMuiTheme({
    palette: {
        type: "dark",
        primary: pink
    }
})

const styles: StyleRulesCallback = theme => ({
    layout: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 2,
        marginRight: theme.spacing.unit * 2,
        [theme.breakpoints.up('lg')]: {
            width: 1200,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        padding: theme.spacing.unit,
    }
});

const title = (width) => {
    let variant: TypographyProps["variant"] = "h1";
    switch (width) {
        case 'sm':
            variant = "h2"
            break
        case 'xs':
            variant = "h3"
            break;
    }
    return <Typography variant={variant} align="center"><b>THE INTOXICATOR</b></Typography>
}

class Home extends React.Component<any, State> {
    constructor(props) {
        super(props)
        const lol = 2 + 2 + 2
        this.state = {
            loading: true,
            pumpValue: 0,
            name: "",
        }
    }

    socket = io('http://localhost:3000')

    componentDidMount() {
        Promise.all([get<Ingredients>("ingredients"), get<Drinks>("drinks")])
            .then(([ingredients, drinks]) => {
                this.setState({
                    ingredients,
                    drinks,
                    loading: false
                })
            })
        this.socket.on("newdrink", () => {
            get<Drinks>("drinks")
                .then(drinks => {
                    this.setState({
                        drinks
                    })
                })
        })
        this.socket.on("newingredient", () => {
            get<Ingredients>("ingredients")
                .then(ingredients => {
                    this.setState({
                        ingredients
                    })
                })
        })
    }

    handlePumpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = 0;
        if (!isNaN(e.target.valueAsNumber) && e.target.valueAsNumber >= 0) {
            value = Math.floor(e.target.valueAsNumber);
        }
        this.setState({
            pumpValue: value
        });
    }

    handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({
            name: e.target.value
        })
    }

    handleIngredient = () => {
        save<Ingredient>("ingredient", { name: this.state.name, pump: this.state.pumpValue })
            .then(() => {
                this.socket.emit("ingredientchange")
            })
    }

    onSubmit = () => {
        console.log('submitted')
        this.socket.emit("drinkchange")
    }

    render() {
        const { classes, width } = this.props;
        const { drinks, ingredients } = this.state;
        return <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    {title(width)}
                    {this.state.loading ? <div /> :
                        <Grid container
                            direction="row"
                            alignItems="stretch"
                            spacing={8}>
                            {Object.getOwnPropertyNames(drinks).filter(e => !Object.getOwnPropertyNames(drinks[e].recipe).some(i => ingredients[i] === undefined))
                                .map(e =>
                                    <Grid item xs={12} sm={6} md={3} key={e}>
                                        <DrinkComp drink={drinks[e]} key={e} ingredients={ingredients} />
                                    </Grid>
                                )}
                        </Grid>}
                </Paper>
                <Paper className={classes.paper}>
                    {this.state.loading ? <div /> : <DrinkMaker ingredients={ingredients} onSubmit={this.onSubmit} />}
                </Paper>
                <Paper className={classes.paper}>
                    <Grid container spacing={8} alignItems="flex-end">
                        <Grid item xs={3}>
                            <TextField
                                label="Pump number"
                                fullWidth
                                onChange={this.handlePumpChange}
                                value={this.state.pumpValue + ""}
                                type="number" />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Name"
                                fullWidth
                                onChange={this.handleNameChange} />
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                color="primary"
                                fullWidth
                                onClick={this.handleIngredient}
                                disabled={this.state.name == ""}
                                variant="contained">
                                Add ingredient
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </main>
        </MuiThemeProvider>;
    }
}

export default withWidth()(withStyles(styles)(Home));