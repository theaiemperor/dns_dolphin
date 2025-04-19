function showModal({
  title = "Hey there! 👋",
  description = "This is a friendly message from your Dolphin UI.",
  isError = false,
  buttonTxt = "Got it!",
  buttonFn = (close) => close(), // Default: auto-close
} = {}) {
  // Remove existing modal
  const existing = document.getElementById("custom-modal");
  if (existing) existing.remove();

  // Palette
  const bgGradient = isError
    ? "linear-gradient(135deg, #ffcdd2, #e57373)"
    : "linear-gradient(135deg, #e0f2f1, #b2dfdb)";

  const buttonColor = isError ? "#c62828" : "#00796b";
  const buttonHover = isError ? "#b71c1c" : "#004d40";

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "custom-modal";
  overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      pointer-events: all;
    `;

  // Modal container
  const modal = document.createElement("div");
  modal.style.cssText = `
      background: ${bgGradient};
      padding: 2rem;
      border-radius: 1rem;
      max-width: 90%;
      width: 400px;
      color: #004d40;
      text-align: center;
      font-family: sans-serif;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    `;

  // Content
  modal.innerHTML = `
      <h2 style="margin-bottom: 0.75rem; font-size: 1.6rem;">${title}</h2>
      <p style="margin-bottom: 1.5rem; font-size: 1rem;">${description}</p>
      <button id="modal-ok-btn" style="
        background: ${buttonColor};
        color: white;
        padding: 0.6rem 1.2rem;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        font-size: 1rem;
        transition: background 0.2s ease-in-out;
      ">
        ${buttonTxt}
      </button>
    `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.body.style.overflow = "hidden";

  const okBtn = modal.querySelector("#modal-ok-btn");
  okBtn.addEventListener("mouseenter", () => {
    okBtn.style.background = buttonHover;
  });
  okBtn.addEventListener("mouseleave", () => {
    okBtn.style.background = buttonColor;
  });

  // Define close handler
  const close = () => {
    document.body.style.overflow = "auto";
    overlay.remove();
  };

  // Use passed fn
  okBtn.addEventListener("click", () => {
    buttonFn(close);
  });
}
