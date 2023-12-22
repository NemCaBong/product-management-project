// Change URL to filter status
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

// delete item button
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  buttonsDelete.forEach((button) => {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    button.addEventListener("click", () => {
      // console.log(button);
      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm hay không?");

      if (isConfirm) {
        const id = button.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;

        formDeleteItem.submit();
      }
    });
  });
}
// end delete item button

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
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}
// end check multi

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();
    const typeChange = e.target.elements.type.value;
    // delete
    if (typeChange == "delete-all") {
      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

      if (!isConfirm) {
        return;
      }
    }

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    if (inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach((input) => {
        const id = input.value;

        if (typeChange == "change-position") {
          const position = input
            .closest("tr")
            .querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });

      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi!");
    }
  });
}
// End Form Change Multi

// Show Alert - req.flash()
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  // flash will carry the popup, we just need to hide
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Alert

// Preview image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End preview image.

//Sort
const sort = document.querySelector("[sort]");
if (sort) {
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");
  let url = new URL(window.location.href);
  sortSelect.addEventListener("change", (e) => {
    const [sortKey, sortValue] = e.target.value.split("-");

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  });

  sortClear.addEventListener("click", (e) => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
  });

  // thêm hiệu ứng selected cho phần option đc chọn
  const sortValue = url.searchParams.get("sortValue");
  const sortKey = url.searchParams.get("sortKey");

  if (sortKey && sortValue) {
    const optionValue = `${sortKey}-${sortValue}`;

    const sortOption = sortSelect.querySelector(
      `option[value='${optionValue}']`
    );
    sortOption.selected = true;
  }
}
// End Sort

// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonsChangeStatus.length > 0) {
  // get the form and path
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const currStatus = button.getAttribute("data-status");
      const id = button.getAttribute("data-id");

      let changeStatus = currStatus === "active" ? "inactive" : "active";
      const actionPath = path + `/${changeStatus}/${id}?_method=PATCH`;

      formChangeStatus.status = changeStatus;
      formChangeStatus.action = actionPath;

      // submit the form while click the button.
      formChangeStatus.submit();
    });
  });
}
// End change status
