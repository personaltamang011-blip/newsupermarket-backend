const API_URL = "https://mart-backend-o7xd.onrender.com";

/* ================= LOAD ORDERS ================= */
async function loadOrders() {
  const container = document.getElementById("orders");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();

    const orders = data.data || data;

    console.log("Orders:", orders); // 🔍 DEBUG

    if (!orders.length) {
      container.innerHTML = "No orders found";
      return;
    }

    container.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");

      let itemsHTML = "";
      (order.items || []).forEach(item => {
        itemsHTML += `<li>${item.name} (Qty: ${item.qty})</li>`;
      });

      div.innerHTML = `
        <hr>
        <p><b>Name:</b> ${order.customer}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Total:</b> Rs ${order.total}</p>

        <ul>${itemsHTML}</ul>

        <p>Status: 
          <span style="color:${order.status === "Delivered" ? "green" : "orange"}">
            ${order.status || "Pending"}
          </span>
        </p>

        <button onclick="updateStatus('${order._id}')">
          ✅ Mark Delivered
        </button>

        <button onclick="deleteOrder('${order._id}')">
          ❌ Delete
        </button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    container.innerHTML = "Error loading orders";
  }
}

/* ================= UPDATE STATUS ================= */
async function updateStatus(id) {
  console.log("Updating ID:", id); // 🔍 DEBUG

  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Delivered" })
    });

    const data = await res.json();
    console.log(data);

    alert("✅ Status Updated!");
    loadOrders();

  } catch (err) {
    console.error(err);
    alert("❌ Failed to update");
  }
}

/* ================= DELETE ORDER ================= */
async function deleteOrder(id) {
  console.log("Deleting ID:", id); // 🔍 DEBUG

  if (!confirm("Delete this order?")) return;

  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    console.log(data);

    alert("🗑️ Order Deleted!");
    loadOrders();

  } catch (err) {
    console.error(err);
    alert("❌ Delete failed");
  }
}