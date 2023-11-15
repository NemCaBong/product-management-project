// Chức năng gửi yêu cầu
const listBtnAddFriends = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriends.length > 0) {
  listBtnAddFriends.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userID = btn.getAttribute("btn-add-friend");
      btn.closest(".box-user").classList.toggle("add");

      socket.emit("CLIENT_ADD_FRIEND", userID);
    });
  });
}

// Hết chức năng gửi yêu cầu
