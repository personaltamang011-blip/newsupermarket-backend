<<<<<<< HEAD
const API_URL = window.location.hostname === "localhost"
  ? "http://localhost:5000"
  : "https://mart-backend-o7xd.onrender.com";
=======
const API_URL = "https://mart-backend-o7xd.onrender.com";
>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3

/* ================= LOAD ORDERS ================= */
async function loadOrders() {
  const container = document.getElementById("orders");
  container.innerHTML = "Loading...";

  try {
    const res = await fetch(`${API_URL}/orders`);
    const data = await res.json();

    const orders = data.data || data;

<<<<<<< HEAD
    console.log("Orders:", orders);
=======
    console.log("Orders:", orders); // 🔍 DEBUG
>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3

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
<<<<<<< HEAD
=======
  console.log("Updating ID:", id); // 🔍 DEBUG

>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3
  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: "Delivered" })
    });

    const data = await res.json();
<<<<<<< HEAD
    console.log("Update:", data);

    if (!res.ok) throw new Error(data.error || "Update failed");
=======
    console.log(data);
>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3

    alert("✅ Status Updated!");
    loadOrders();

  } catch (err) {
    console.error(err);
    alert("❌ Failed to update");
  }
}

<<<<<<< HEAD
/* ================= DELETE ================= */
async function deleteOrder(id) {
=======
/* ================= DELETE ORDER ================= */
async function deleteOrder(id) {
  console.log("Deleting ID:", id); // 🔍 DEBUG

>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3
  if (!confirm("Delete this order?")) return;

  try {
    const res = await fetch(`${API_URL}/order/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
<<<<<<< HEAD
    console.log("Delete:", data);

    if (!res.ok) throw new Error(data.error || "Delete failed");
=======
    console.log(data);
>>>>>>> 1604130149f61ccf79819dab14f1fc7a79e13da3

    alert("🗑️ Order Deleted!");
    loadOrders();

  } catch (err) {
    console.error(err);
    alert("❌ Delete failed");
  }
}