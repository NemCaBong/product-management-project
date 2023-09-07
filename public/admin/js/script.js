const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  // create new URL obj using current URL location
  let url = new URL(window.location.href);
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      // override the current address
      window.location.href = url;
    });
  });
}
// End Button Status

// Form Search
const formSearch = document.getElementById("form-search");
if (formSearch) {
  let url = new URL(window.location.href);

  formSearch.addEventListener("submit", (e) => {
    // ngan cho form chuyen website den 1 URL moi
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url;
  });
}

// Pagination
const paginationButtons = document.querySelectorAll("[button-page]");
if (paginationButtons) {
  let url = new URL(window.location.href);
  for (let button of paginationButtons) {
    button.addEventListener("click", () => {
      const pageNum = button.getAttribute("button-page");
      console.log(pageNum);
      url.searchParams.set("page", pageNum);
      window.location.href = url.href;
    });
  }
}
