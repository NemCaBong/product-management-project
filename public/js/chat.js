import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();

    // content là name của thẻ input.
    const content = e.target.elements.content.value;

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      e.target.elements.content.value = "";
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// END CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE

// đoạn code này sẽ lo liệu làm cho tin nhắn hiển thị
// ngay sau khi người dùng submit bên client
// submit => client -> server: content => server -> client: data{} để hiển thị
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  // lấy data và hiển thị ra giao diện
  const myID = document.querySelector("[my-id]").getAttribute("my-id");
  const innerBody = document.querySelector(".chat .inner-body");

  const innerListTyping = document.querySelector(".chat .inner-list-typing");
  const div = document.createElement("div");
  let innerName = "";

  // Nếu kph tin nhắn của mình thì hiển thị theo kiểu khác
  if (myID === data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    innerName = `<div class="inner-name">${data.fullName}</div>`;
    div.classList.add("inner-incoming");
  }

  div.innerHTML = `
    ${innerName}
    <div class="inner-content">${data.content}</div>
  `;
  innerBody.insertBefore(div, innerListTyping);

  // làm thanh scroll xuống dưới sau khi hiển thị xong
  innerBody.scrollTop = innerBody.scrollHeight;
});

// END SERVER_RETURN_MESSAGE

// Sửa scroll chat xuống dưới cùng
const innerBody = document.querySelector(".chat .inner-body");
if (innerBody) {
  // làm cho thanh scroll cách top 1 đoạn =  chính chiều cao scroll
  innerBody.scrollTop = innerBody.scrollHeight;
}
// END

// show icon picker
const button = document.querySelector(".button-icon");
if (button) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(button, tooltip);

  button.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// end icon picker
var timeOut;

const showTypingSocket = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  // clear nó mỗi khi đang gõ.
  clearTimeout(timeOut);

  // sau 3s bỏ phím thì sẽ hide cái đang type đi
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};

// Send Socket to show Typing
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
    const end = inputChat.value.length;
    // đẩy con trỏ xuống cuối đoạn chat.
    inputChat.setSelectionRange(end, end);
    inputChat.focus();
    showTypingSocket();
  });

  inputChat.addEventListener("keyup", () => {
    showTypingSocket();
  });
}
// end send socket show typing

// Receive server return to show typing
const elemListTyping = document.querySelector(".chat .inner-list-typing");
if (elemListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type === "show") {
      // kiểm tra tồn tại chưa
      // để tránh vẽ ra nhiều lần
      // theo socket
      const exists = elemListTyping.querySelector(
        `[user-id="${data.user_id}"]`
      );

      if (!exists) {
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.user_id);

        boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      `;

        elemListTyping.appendChild(boxTyping);
        innerBody.scrollTop = innerBody.scrollHeight;
      }
    } else if (data.type === "hidden") {
      const boxTypingRemoved = elemListTyping.querySelector(
        `[user-id="${data.user_id}"]`
      );

      // phải check nếu có mới xóa không thì bị lỗi
      if (boxTypingRemoved) {
        // xóa thẻ con từ thẻ cha.
        elemListTyping.removeChild(boxTypingRemoved);
      }
    }
  });
}
