const express = require("express");
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

// Routes
const routeAdmin = require("./routes/admin/index.route");
const route = require("./routes/client/index.route");
routeAdmin(app);
route(app);

app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
