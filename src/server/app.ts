import express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
import net = require('net');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
import { NextFunction } from '../../node_modules/@types/connect';
import get from './routes/get'
import save from './routes/save'
import { Request } from "../types"
import { DrinkRecipe, toBytes, ingredients, drinks } from '../drinks';

const socketport = 42069;

let socket: net.Socket = null;

const server = net.createServer(sock => {
    console.log("connection established");
    sock.on("end", () => {
        console.log("connection closed");
        socket = null;
    })
    sock.on("error", () => {
        console.log("error");
        socket = null;
    })
    sock.on("timeout", () => {
        console.log("timeout");
    })
    socket = sock;
})

server.listen(socketport, () => {
    console.log("listening");
})

const app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req: Request<any>, res, next) => {
    req.sendDrink = (drink: DrinkRecipe) => {
        if (socket === null)
            return false;
        socket.write(toBytes(drink))
        return true;
    }
    req.ingredients = ingredients;
    req.drinks = drinks;
    next();
})

app.use("/api/get", get)
app.use("/api/save", save)

app.use((req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"))
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = { ...new Error('Not Found'), status: 404 };
    next(err);
});

// error handler
app.use(function (err: { status: number }, req: express.Request, res: express.Response, next: NextFunction) {
    res.send(err.status)
});

export { app };
