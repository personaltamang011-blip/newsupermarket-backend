async function loadOrders() {
  try {
    const res = await fetch("http://localhost:5000/orders");
    const orders = await res.json();

    const container = document.getElementById("orders");
    container.innerHTML = "";

    orders.forEach(order => {
      const div = document.createElement("div");

      div.innerHTML = `
        <hr>
        <p><b>Name:</b> ${order.customer}</p>
        <p><b>Phone:</b> ${order.phone}</p>
        <p><b>Total:</b> Rs ${order.total}</p>
        <p><b>Items:</b></p>
        <ul>
          ${order.items.map(item => `
            <li>${item.name} (Qty: ${item.qty})</li>
          `).join("")}
        </ul>
      `;

      container.appendChild(div);
    });

  } catch (err) {
    console.error(err);
    alert("Error loading orders");
  }
}