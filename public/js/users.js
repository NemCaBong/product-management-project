// Chức năng gửi yêu cầu kết bạn
const listBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriends.length > 0) {
  listBtnAddFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.getAttribute("btn-add-friend");
      btn.closest(".box-user").classList.add("add");

      socket.emit("CLIENT_ADD_FRIEND", userID);
    });
  });
}

// Hết chức năng gửi yêu cầu kết bạn

// Chức năng hủy gửi yc kết bạn
const listBtnCancelFriends = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriends.length > 0) {
  listBtnCancelFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.getAttribute("btn-cancel-friend");
      btn.closest(".box-user").classList.remove("add");

      socket.emit("CLIENT_CANCEL_FRIEND", userID);
    });
  });
}

// Hủy gửi yêu cầu kết bạn
