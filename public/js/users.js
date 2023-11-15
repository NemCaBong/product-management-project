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

// Chức năng từ chối yc kết bạn
const listBtnRefuseFriends = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriends.length > 0) {
  listBtnRefuseFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.getAttribute("btn-refuse-friend");

      btn.closest(".box-user").classList.add("refuse");

      socket.emit("CLIENT_REFUSE_FRIEND", userID);
    });
  });
}

// TỪ chối yêu cầu kết bạn

// Chức năng chap nhan yc kết bạn
const listBtnAcceptFriends = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriends.length > 0) {
  listBtnAcceptFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.getAttribute("btn-accept-friend");

      btn.closest(".box-user").classList.add("accepted");

      socket.emit("CLIENT_ACCEPT_FRIEND", userID);
    });
  });
}

// Chap nhan yc kết bạn

// Nhận về số lượng người kết bạn
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
  const userID = badgeUserAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userID === data.user_id) {
      badgeUserAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}

// Kết thúc nhận số lượng người kết bạn
