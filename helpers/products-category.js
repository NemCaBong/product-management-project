const ProductCategory = require("../models/product-category.model");

module.exports.getSubCategories = async (parentID) => {
  // tách nó ra thành function để có thể đệ quy.
  const getSubCategory = async (parentID) => {
    const subCategories = await ProductCategory.find({
      deleted: false,
      parent_id: parentID,
      status: "active",
    });

    let allSubs = [...subCategories];

    for (const sub of subCategories) {
      const childs = await getSubCategory(sub.id);
      allSubs = allSubs.concat(childs);
    }

    return allSubs;
  };

  const result = await getSubCategory(parentID);
  return result;
};
