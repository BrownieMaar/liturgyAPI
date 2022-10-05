const express = require("express");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "http://localhost:3000", methods: "GET,PUT,POST,DELETE" }))

const port = 9001;



app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/../frontend/index.html"));
});

app.get("/api/liturgy", async (req, res) => {
    const file = await fs.readFile(path.join(`${__dirname}/liturgy.json`));
    const liturgy = JSON.parse(file);
    console.log(req.method + " /api/liturgy");
    res.json(liturgy);
});

app.get("/api/:objpath", async (req, res) => {
    console.log(req.method + " /api/liturgy/" + req.params.objpath);
    const file = await fs.readFile(path.join(`${__dirname}/liturgy.json`));
    const liturgy = JSON.parse(file)
    const routeInObj = req.params.objpath.split("-");
    let elementToFind = liturgy;
    for (let step of routeInObj) {
        elementToFind = elementToFind[step];
    }
    res.json(elementToFind);
});

app.post("/api/:objpath", async (req, res) => {
    console.log(req.method + " /api/liturgy/" + req.params.objpath);
    const file = await fs.readFile(path.join(`${__dirname}/liturgy.json`));
    const liturgy = JSON.parse(file);
    const incomingObj = req.body;
    let placeInObj = liturgy;
    const routeInObj = req.params.objpath.split("-");
    for (let step of routeInObj) {
        placeInObj = placeInObj[step];
    }

    incomingObj.id = Math.max(...placeInObj.map(lit => lit.id)) + 1;
    if (incomingObj.id === Number.NEGATIVE_INFINITY) incomingObj.id = 1;
    incomingObj.name = incomingObj.name + " copy";

    placeInObj.push(incomingObj);

    fs.writeFile(path.join(__dirname + "/liturgy.json"), JSON.stringify(liturgy, null, 4))
        .then(() => res.status(200).send("DONE"));
});

app.put("/api/:objpath", async (req, res) => {
    console.log(req.method + " /api/liturgy/" + req.params.objpath);
    const file = await fs.readFile(path.join(`${__dirname}/liturgy.json`));
    const liturgy = JSON.parse(file);
    const incomingObj = req.body;
    let placeInObj = liturgy;
    const route = req.params.objpath.split("-");
    const reducedRoute = route.slice(0, route.length - 1)
    const indexToRemove = parseInt(route[route.length - 1]);
    const routeOfParentInObj = reducedRoute;
    for (let step of routeOfParentInObj) {
        placeInObj = placeInObj[step];
    }

    placeInObj[indexToRemove] = incomingObj;


    fs.writeFile(path.join(__dirname + "/liturgy.json"), JSON.stringify(liturgy, null, 4))
        .then(() => res.status(200).send("DONE"));
});

app.delete("/api/:objpath", async (req, res) => {
    console.log(req.method + " /api/liturgy/" + req.params.objpath);
    const file = await fs.readFile(path.join(`${__dirname}/liturgy.json`));
    const liturgy = JSON.parse(file);
    let placeInObj = liturgy;
    const route = req.params.objpath.split("-");
    const reducedRoute = route.slice(0, route.length - 1)
    const indexToRemove = parseInt(route[route.length - 1]);
    const routeOfParentInObj = reducedRoute;
    for (let step of routeOfParentInObj) {
        placeInObj = placeInObj[step];
    }

    placeInObj.splice(indexToRemove, 1);

    // console.log(JSON.stringify(liturgy));

    fs.writeFile(path.join(__dirname + "/liturgy.json"), JSON.stringify(liturgy, null, 4))
        .then(() => res.status(200).send("DONE"));
});

/**
 * @param  {string} name Is the name of the person doing the greeting.
 * * This function does it all. Trust me. Just like {@link port}
 * ! Alert, this function is a joke!
 * TODO make something useful
 * 
 */
function heyGuys(name) {
    return "Hey guys, I'm " + name + "!";
}

/*
configure user snippets

*/

app.listen(port, _ => console.log("http://127.0.0.1:" + port));