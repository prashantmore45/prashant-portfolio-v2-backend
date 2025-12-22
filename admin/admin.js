// backend/admin/admin.js
const API = "/admin-api";
const token = localStorage.getItem("adminToken");

if (!token && !location.pathname.endsWith("/login.html")) {
  location.href = "/admin/login.html";
}

// helper to call admin api
async function adminFetch(path, opts = {}) {
  opts.headers = opts.headers || {};
  opts.headers.Authorization = "Bearer " + token;

  const res = await fetch(API + path, opts);

  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("adminToken");
    location.href = "/admin/login.html";
    throw new Error("Unauthorized");
  }

  return res.json();
}

async function loadDashboard() {
  try {
    const v = await adminFetch("/visitors");
    document.getElementById("visitorsCount").innerText = v.total || 0;

    const messages = await adminFetch("/messages");
    document.getElementById("totalMessages").innerText = messages.length;

    const tbody = document.querySelector("#messagesTable tbody");
    tbody.innerHTML = "";

    messages.forEach(m => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${m._id}</td>
        <td>${m.name}</td>
        <td>${m.email}</td>
        <td>${m.message}</td>
        <td>${new Date(m.createdAt).toLocaleString()}</td>
        <td>
          <button class="actionBtn" data-id="${m._id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // bind delete buttons
    tbody.querySelectorAll(".actionBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        if (!confirm("Delete message?")) return;
        await adminFetch("/messages/" + id, { method: "DELETE" });
        loadDashboard();
      });
    });

  } catch (err) {
    console.error(err);
  }
}

if (location.pathname.endsWith("/dashboard.html")) {
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    location.href = "/admin/login.html";
  });

  document.getElementById("exportBtn").addEventListener("click", () => {
    window.location = API + "/export";
  });

  loadDashboard();
}
