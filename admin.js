/* ================= CONFIG ================= */
const API_BASE = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://mart-backend-o7xd.onrender.com";

/* ================= LOAD ORDERS ================= */
async function loadOrders() {
  const container = document.getElementById("orders");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_BASE}/orders`);
    const data = await res.json();
    const orders = data.data || data;

    if (!orders.length) {
      container.innerHTML = "No orders found";
      return;
    }

    container.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");
      div.style.border = "1px solid #ccc";
      div.style.padding = "10px";
      div.style.margin = "10px";

      let itemsHTML = "";
      (order.items || []).forEach(item => {
        itemsHTML += `<li>${item.name} (Qty: ${item.qty})</li>`;
      });

      const status = order.status || "Pending";

      div.innerHTML = `
        <hr>
        <p><b>Name:</b> ${order.customer}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Total:</b> Rs ${order.total}</p>
        <p><b>Items:</b></p>
        <ul>${itemsHTML}</ul>
        <p><b>Status:</b> 
          <span style="color:${status === "Pending" ? "orange" : "green"}">
            ${status}
          </span>
        </p>
        <button onclick="updateStatus('${order._id}', 'Delivered')">✅ Mark Delivered</button>
        <button onclick="deleteOrder('${order._id}')">❌ Delete</button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "Error loading orders";
  }
}

/* ================= DELETE ORDER ================= */
async function deleteOrder(id) {
  if (!confirm("Are you sure you want to delete this order?")) return;

  try {
    await fetch(`${API_BASE}/order/${id}`, { method: "DELETE" });
    alert("Order deleted!");
    loadOrders();
  } catch (err) {
    console.error(err);
    alert("Error deleting order");
  }
}

/* ================= UPDATE STATUS ================= */
async function updateStatus(id, status) {
  try {
    await fetch(`${API_BASE}/order/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    alert("Status updated!");
    loadOrders();
  } catch (err) {
    console.error(err);
    alert("Error updating status");
  }
}