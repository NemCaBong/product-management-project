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
