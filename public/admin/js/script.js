const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
  // create new URL obj using current URL location
  let url = new URL(window.location.href);
  buttonStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("button-status");

      if (status) {
        url.searchParams.set("status", status);
        // set page to 1 if change the status
        url.searchParams.set("page", 1);
      } else {
        url.searchParams.delete("status");
        url.searchParams.delete("page");
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
      // console.log(pageNum);
      url.searchParams.set("page", pageNum);
      window.location.href = url.href;
    });
  }
}
// Check multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

  // click the checkallButton
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputIds.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputIds.forEach((input) => {
        input.checked = false;
      });
    }
  });

  // add event for each checkbox
  inputIds.forEach((input) => {
    input.addEventListener("click", () => {
      // using querySelectorAll to see how many box are checked.
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      if (countChecked === inputIds.length) {
        inputCheckAll.checked = true;
      }
    });
  });
}
// end check multi

// Form ChangeMulti
const formCheckAll = document.querySelector("[form-change-multi]");
if (formCheckAll) {
  formCheckAll.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkedInput = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const inputOfForm = document.querySelector("input[name='ids']");
    // lay value trong type
    const typeChange = e.target.elements.type.value;
    if (typeChange === "delete-all"){
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này? ")

      if(!isConfirm){
        return
      }
    }

    if (checkedInput.length > 0) {
      let checkedInputArr = [];

      checkedInput.forEach((input) => {
        checkedInputArr.push(input.value);
      });

      inputOfForm.value = checkedInputArr.join(", ");

      formCheckAll.submit();
    } else {
      alert("Chon 1 ban ghi");
    }

  });
}
// End FormChangeMulti
