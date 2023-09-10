const express = require("express");
const methodOverride = require("method-override");
const app = express();

// import .env file
require("dotenv").config();

// connect mongodb
const database = require("./config/database");
database.connect();
// config port
const port = process.env.PORT;

// App Local Var
const systemConfig = require("./config/system");
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

// usemethod override
app.use(methodOverride("_method"));

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
routeAdmin(app);
route(app);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
