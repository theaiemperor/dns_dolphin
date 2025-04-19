document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("server-form");
  const nameInput = document.getElementById("name");
  const ipInput = document.getElementById("ip");
  const portInput = document.getElementById("port");
  const submitButton = document.getElementById("submit-button");
  const serverList = document.getElementById("server-list");

  let servers = {};
  let editKey = null;

  async function handleSubmit(name, ip, port) {
    const serverData = { ip, port };
    const result = await addServer({ name, ...serverData });
    if (result.success) {
      servers[name] = result.data[name];
      renderServers();
      applyWaveAnimation();
      resetForm();
    } else {
      showModal({ title: "Server Not added", description: result.message });
    }
  }

  async function handleStartup() {
    const result = await fetchServers();
    if (result.success) {
      servers = result.data;
    } else {
      showModal({
        title: "Error fetching servers",
        description: result.message,
      });
    }
    renderServers();
    applyWaveAnimation();
  }

  async function handleUpdate(id, name, ip, port) {
    const serverData = { ip, port };
    const result = await updateServer({ id, name, ...serverData });

    if (result.success) {
      if (id !== name) delete servers[id];
      servers[name] = serverData;
      renderServers();
      applyWaveAnimation();
      resetForm();
    } else {
      showModal({ title: "Server Not updated", description: result.message });
    }
  }

  async function handleDelete(id) {
    const result = await deleteServer({ id });
    if (result.success) {
      delete servers[id];
      renderServers();
      applyWaveAnimation();
    } else {
      showModal({ title: "Server Not deleted", description: result.message });
    }
  }

  function renderServers() {
    serverList.innerHTML = "";
    Object.entries(servers).forEach(([name, { ip, port }]) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="col-name">${name}</td>
        <td class="col-ip">${ip}</td>
        <td class="col-port">${port}</td>
        <td class="col-actions">
          <button class="action-btn update-btn" data-key="${name}" title="Update">
            ✏️
          </button>
          <button class="action-btn delete-btn" data-key="${name}" title="Delete">
            🗑️
          </button>
        </td>
      `;
      serverList.appendChild(row);
    });
  }

  function resetForm() {
    nameInput.value = "";
    portInput.value = "";
    submitButton.textContent = "Add Server";
    editKey = null;
  }

  function applyWaveAnimation() {
    const rows = serverList.querySelectorAll("tr");
    rows.forEach((row, i) => {
      row.style.animation = `wave 0.6s ease ${i * 0.1}s forwards`;
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const ip = ipInput.value.trim();
    const port = portInput.value.trim();

    if (!name || !ip || !port) return;

    if (editKey !== null) {
      handleUpdate(editKey, name, ip, port);
    } else {
      handleSubmit(name, ip, port);
    }
  });

  serverList.addEventListener("click", async (e) => {
    const updateBtn = e.target.closest(".update-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (updateBtn) {
      const key = updateBtn.dataset.key;
      const { ip, port } = servers[key];
      nameInput.value = key;
      ipInput.value = ip;
      portInput.value = port;
      submitButton.textContent = "Update Server";
      editKey = key;
    } else if (deleteBtn) {
      const id = deleteBtn.dataset.key;
      await handleDelete(id);
    }
  });

  await handleStartup();
});
