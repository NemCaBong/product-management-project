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
  innerBody.append(div);
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
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
const button = document.querySelector(".button-icon");
if (button) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(button, tooltip);

  document.querySelector(".button-icon").onclick = () => {
    tooltip.classList.toggle("shown");
  };
}
// end icon picker

// insert emoji to input
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
  });
}
// end insert emoji
