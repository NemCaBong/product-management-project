module.exports = (query, totalItems) => {
  // phan phan trang
  const objectPagination = {
    currentPage: 1,
    limitItems: 5,
  };

  if (query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }

  // tổng số trang cần
  objectPagination.totalPages = Math.ceil(
    totalItems / objectPagination.limitItems
  );
  // sản phẩm bắt đầu lấy
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems;
  return objectPagination
};
