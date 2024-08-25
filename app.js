const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const ownersRouter = require("./route/ownersRouter");
const productsRouter = require("./route/productsRouter");
const usersRouter = require("./route/usersRouter");
const index = require('./route/index');
const expressSession = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

const db = require('./config/mongoose-connection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.JWT_KEY,
}));
app.use(flash());

app.use("/users", usersRouter);
app.use("/owners", ownersRouter);
app.use("/products", productsRouter);
app.use("/", index);





app.listen(process.env.PORT);

