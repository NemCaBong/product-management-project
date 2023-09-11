// Change Status of Product
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

//
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
  buttonsDelete.forEach((button) => {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");
    button.addEventListener("click", () => {
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
