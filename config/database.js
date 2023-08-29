const mongoose = require("mongoose");

module.exports.connect = async () => {
	console.log(process.env.MONGO_URL);
	try {
		await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("Connect success");
	} catch (error) {
		console.log("Connect failed ", error);
	}
};
