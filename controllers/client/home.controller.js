// index la controller  danh cho trang chu
module.exports.index = (req, res) => {
	res.render("client/pages/home/index.pug", {
		pageTitle: "Trang chủ",
	});
};
