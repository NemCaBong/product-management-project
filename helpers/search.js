module.exports = (query) => {
  let searchObject = {
    keyword: "",
  };

  if (query.keyword) {
    searchObject.keyword = query.keyword;
    const regex = new RegExp(searchObject.keyword, "i");
    searchObject.keywordRegex = regex;
  }
  return searchObject;
};
