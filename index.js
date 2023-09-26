const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const app = express();
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");

// import .env file
require("dotenv").config();

// connect mongodb
const database = require("./config/database");
database.connect();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// config port
const port = process.env.PORT;

// App Local Var
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static(`${__dirname}/public`));
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// usemethod override
app.use(methodOverride("_method"));

// Set up Flash
app.use(cookieParser("Goldenretriever"));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End Flash

// Routes
const routeAdmin = require("./routes/admin/index.route");
const routeClient = require("./routes/client/index.route");
routeAdmin(app);
routeClient(app);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
