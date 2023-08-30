const express = require("express");
require("dotenv").config();

const database = require("./config/database");
database.connect();

const port = process.env.PORT;

const app = express();
app.use(express.static("public"));
app.set("views", "./views");
app.set("view engine", "pug");

// Routes
const route = require("./routes/client/index.route");
const routeAdmin = require("./routes/admin/index.route");
route(app);
routeAdmin(app);
app.listen(port, () => {
	console.log(`Example app listening on port: ${port}`);
});
