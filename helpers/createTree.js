const Account = require("../models/account.model");

let count = 0;
const createTree = (arr, parentId = "") => {
  const tree = [];

  arr.forEach((item) => {
    if (item.parent_id === parentId) {
      const newItem = item;
      count++;
      newItem.index = count;
      const children = createTree(arr, item.id);

      if (children.length > 0) {
        newItem.children = children;
      }
      tree.push(newItem);
    }
  });
  return tree;
};

// Nếu dùng đệ quy mà export luôn thì nó sẽ không hiểu
// cái hàm đệ quy là gì nên chúng ta cần export 1 cái hàm khác chứa hàm đệ quy đó
module.exports.tree = (arr, parentId = "") => {
  // make count to 0 after every reload
  // because server not reload.
  count = 0;
  const tree = createTree(arr, (parentId = ""));

  return tree;
};

module.exports.displayLogs = async (categories) => {
  async function update(category) {
    const updatedCategory = { ...category }; // Tạo một bản sao của category để thêm vào updatedCategories
    // Cập nhật thông tin cho createdBy
    const createdByUser = await Account.findOne({
      _id: category.createdBy.account_id,
    }).select("fullName createdBy");
    if (createdByUser) {
      updatedCategory.createdBy.accountFullName = createdByUser.fullName;
    }
    // Cập nhật thông tin cho updatedBy
    const updatedBy = category.updatedBy.slice(-1)[0];
    if (updatedBy) {
      const updatedByUser = await Account.findOne({
        _id: updatedBy.account_id,
      }).select("fullName updatedBy");
      if (updatedByUser) {
        updatedBy.accountFullName = updatedByUser.fullName;
      }
    }
    // Cập nhật thông tin cho các category con nếu có
    if (Array.isArray(category.children) && category.children.length > 0) {
      const updatedChildren = [];
      for (const childCategory of category.children) {
        const updatedChild = await update(childCategory);
        updatedChildren.push(updatedChild); // Thêm các category con đã được cập nhật vào updatedChildren
      }
      updatedCategory.children = updatedChildren;
    }
    return updatedCategory;
  }

  try {
    const updatedCategories = [];
    for (const category of categories) {
      const categoryUpdated = await update(category);
      updatedCategories.push(categoryUpdated);
    }
    return updatedCategories;
  } catch (error) {
    console.log(error);
  }
};
