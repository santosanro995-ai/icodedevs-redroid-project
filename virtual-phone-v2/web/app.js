import RFB from "/remote/core/rfb.js";

const screen = document.querySelector("#screen");
const status = document.querySelector("#status");
const statusText = document.querySelector("#status-text");
const message = document.querySelector("#message");
const messageText = document.querySelector("#message-text");
const reconnectButton = document.querySelector("#reconnect");
const fullscreenButton = document.querySelector("#fullscreen");

let connection;

function setStatus(text, connected) {
  statusText.textContent = text;
  status.classList.toggle("connected", connected);
  message.hidden = connected;
}

function connect() {
  if (connection) {
    connection.disconnect();
  }

  screen.replaceChildren();
  messageText.textContent = "Menghubungkan ke Android...";
  setStatus("Menghubungkan ke Android...", false);

  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const currentConnection = new RFB(
    screen,
    `${protocol}//${window.location.host}/remote/websockify`,
  );
  connection = currentConnection;
  currentConnection.scaleViewport = true;
  currentConnection.resizeSession = false;
  currentConnection.showDotCursor = true;

  currentConnection.addEventListener("connect", () => {
    if (connection !== currentConnection) return;
    setStatus("Terhubung", true);
  });

  currentConnection.addEventListener("disconnect", (event) => {
    if (connection !== currentConnection) return;
    const reason = event.detail.reason || "Koneksi Android terputus.";
    statusText.textContent = "Terputus";
    status.classList.remove("connected");
    messageText.textContent = reason;
    message.hidden = false;
  });
}

reconnectButton.addEventListener("click", connect);
fullscreenButton.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    messageText.textContent = `Mode layar penuh tidak tersedia: ${error.message}`;
    message.hidden = false;
  }
});

connect();
