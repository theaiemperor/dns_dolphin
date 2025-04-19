async function fetchServers() {
  const req = await fetch("/api");
  const res = await req.json();
  return res;
}

async function addServer({ name, port, ip }) {
  const req = await fetch("/api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, port, ip }),
  });
  const res = await req.json();
  return res;
}

async function updateServer({ id, name, port, ip }) {
  const req = await fetch("/api/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, port, ip }),
  });
  const res = await req.json();
  return res;
}

async function deleteServer({ id }) {
  const req = await fetch("/api/" + id, {
    method: "DELETE",
  });
  const res = await req.json();
  return res;
}
