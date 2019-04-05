const net = require('net');
const { drinks, pumps } = require("./drinks");

const port = 42069;

const toRatios = (drink) => {
    const sum = Object.getOwnPropertyNames(drink).reduce((acc, c) => acc + drink[c], 0)
    return Object.getOwnPropertyNames(drink).reduce((acc, c) => {
        acc[c] = drink[c] / sum;
        return acc;
    }, {})
}

const toBytesFromRatio = (drink, pumps) => {
    const ingredients = Object.getOwnPropertyNames(drink)
    const arr = ingredients.reduce((acc, c) => {
        acc.push(pumps[c], Math.floor(drink[c] * 255));
        return acc;
    }, [])
    return new Buffer(arr);
}

const toBytes = (drink, pumps) => {
    return toBytesFromRatio(toRatios(drink), pumps)
}

const server = net.createServer(socket => {
    console.log("connection established");
    socket.write(toBytes(drinks.ginAndJuice, pumps));
    socket.on("end", () => {
        console.log("connection closed");
    })
})

server.listen(port, () => {
    console.log("listening");
})

console.log("does this work");

//data sent to python should be in this format:
//1 drink per send
//a series of:
//1 byte of pump number
//1 byte of ratio portion
//eg:
//00, 7F, 01, 80
//meaning pump 0 for a ratio of 7F/FF (127/255) or ~1/2
//and pump 1 for a ratio of 80/FF (128/255) or ~1/2
//possibly include cup size at beginning