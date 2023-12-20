// Đoạn code chỉ đc sử dụng cho /admin/roles.

// permissions
const tablePermissions = document.querySelector("[table-permissions]");

if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");

  buttonSubmit.addEventListener("click", () => {
    // ban đầu là mảng rỗng sau đó lặp qua từng hàng.
    let permissions = [];

    // querySelectorAll đến các cái tr có data-name
    // mỗi row là giá trị tick row đó của từng roles.
    const rows = tablePermissions.querySelectorAll("[data-name]");

    rows.forEach((row) => {
      // từ mỗi hàng lấy ra giá trị của hàng đó:
      // có từ id - view - create, ...
      const name = row.getAttribute("data-name");

      const inputs = row.querySelectorAll("input");

      // Nếu hàng đó là hàng chứa id
      // thì chúng ta lấy ra id để push vào mảng permissions.
      // từ đó có các objects trong mảng.
      if (name == "id") {
        inputs.forEach((input) => {
          const id = input.value;
          permissions.push({
            id: id,
            permissions: [],
          });
        });
      } else {
        inputs.forEach((input, index) => {
          const checked = input.checked;
          if (checked) {
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector(
        "#form-change-permissions"
      );
      const inputPermissions = formChangePermissions.querySelector(
        "input[name='permissions']"
      );
      // Vì value của thẻ input lưu dưới dạng 1 chuỗi => Đổi permissons
      // thành chuỗi json thì mới có thể lưu vào value của thẻ input đc.
      inputPermissions.value = JSON.stringify(permissions);
      formChangePermissions.submit();
    }
  });
}
// end permissions

// default permissions display
const dataRecords = document.querySelector("[data-records]");
if (dataRecords) {
  // lấy ra all bản ghi roles trong DB
  const records = JSON.parse(dataRecords.getAttribute("data-records"));

  records.forEach((record, index) => {
    const permissions = record.permissions;
    permissions.forEach((permission) => {
      const row = tablePermissions.querySelector(`[data-name='${permission}']`);
      // phải truyền index vào bởi vì sẽ có số input theo số lượng roles.
      // mà chúng ta có
      const input = row.querySelectorAll("input")[index];
      input.checked = true;
    });
  });
}
// end default permission display
