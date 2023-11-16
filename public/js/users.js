/**
 * File này để lo liệu các sự kiện socket
 * Từ server trả về cho bên phía client
 */

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
// SERVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
  const userID = badgeUserAccept.getAttribute("badge-users-accept");
  socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
    if (userID === data.user_id) {
      badgeUserAccept.innerHTML = data.lengthAcceptFriends;
    }
  });
}
// END SERVER_RETURN_LENGTH_ACCEPT_FRIEND
// Kết thúc nhận số lượng người kết bạn

// Chức năng từ chối kết bạn
const refuseFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("refuse");

    const userId = button.getAttribute("btn-refuse-friend");

    socket.emit("CLIENT_REFUSE_FRIEND", userId);
  });
};
// Chức năng chấp nhận kết bạn
const acceptFriend = (button) => {
  button.addEventListener("click", () => {
    button.closest(".box-user").classList.add("accepted");

    const userId = button.getAttribute("btn-accept-friend");

    socket.emit("CLIENT_ACCEPT_FRIEND", userId);
  });
};

// SERVER_RETURN_INFO_ACCEPT_FRIEND
// Trả về thông tin của người gửi yêu cầu kết bạn
const dataUserAccept = document.querySelector("[data-users-accept]");
if (dataUserAccept) {
  const userIDOfSender = dataUserAccept.getAttribute("data-users-accept");

  socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    if (userIDOfSender === data.userID) {
      // vẽ user ra giao diện
      const div = document.createElement("div");
      div.classList.add("col-6");
      div.innerHTML = `
        <div class="box-user">
          <div class="inner-avatar">
            <img src="/images/avatar.png" alt="${data.infoUserSender.fullName}">
          </div>
          <div class="inner-info">
            <div class="inner-name">
            ${data.infoUserSender.fullName}
            </div>
            <div class="inner-buttons">
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accept-friend="${data.infoUserSender._id}"
              >
                Chấp nhận
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-refuse-friend="${data.infoUserSender._id}"
              >
                Xóa
              </button>
              <button
                class="btn btn-sm btn-secondary mr-1"
                btn-deleted-friend=""
                disabled=""
              >
                Đã xóa
              </button>
              <button
                class="btn btn-sm btn-primary mr-1"
                btn-accepted-friend=""
                disabled=""
              >
                Đã chấp nhận
              </button>
            </div>
          </div>
        </div>
      `;

      dataUserAccept.appendChild(div);
      // hết vẽ giao diện

      // Hủy lời mời kết bạn
      const buttonRefuse = div.querySelector("[btn-refuse-friend]");
      refuseFriend(buttonRefuse);
      // Hết Hủy lời mời kết bạn

      // Chấp nhận lời mời kết bạn
      const buttonAccept = div.querySelector("[btn-accept-friend]");
      acceptFriend(buttonAccept);
      // Hết Chấp nhận lời mời kết bạn
    }
  });
}

// END SERVER_RETURN_INFO_ACCEPT_FRIEND