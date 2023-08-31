const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
	let find = {
		deleted: false,
	};

	// thuoc tinh class de truyen classCss vao
	let filterStatus = [
		{
			name: "Tất cả",
			status: "",
			class: "",
		},
		{
			name: "Hoạt động",
			status: "active",
			class: "",
		},
		{
			name: "Dừng hoạt động",
			status: "inactive",
			class: "",
		},
	];

	if (req.query.status) {
		const index = filterStatus.findIndex(
			(item) => item.status === req.query.status
		);
		filterStatus[index].class = "active";
		// neu co query status => cho vao find.
		find.status = req.query.status;
	} else {
		filterStatus[0].class = "active";
	}

	const products = await Product.find(find);

	res.render("admin/pages/products/index", {
		pageTitle: "Danh sách sản phẩm",
		products: products,
		filterStatus: filterStatus,
	});
};
