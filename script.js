document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".add-to-cart-btn")) {
    setupProductPage();
  }
  if (document.querySelector(".add-to-cart-card-btn")) {
    setupCardButtons();
  }
  if (document.querySelector(".cart-table")) {
    loadCart();
  }
  updateCartCount();
});

function setupProductPage() {
  var addToCartBtn = document.querySelector(".add-to-cart-btn");
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      var titleEl = document.querySelector(".product-title");
      var priceEl = document.querySelector(".current-price-large");
      var imageEl = document.querySelector(".main-image img");
      var qtyEl = document.querySelector(".qty-input");

      var product = {
        id: Date.now(),
        name: titleEl ? titleEl.innerText : "Product",
        price: priceEl ? parseFloat(priceEl.innerText.replace("$", "")) : 0,
        image: imageEl ? imageEl.src : "",
        quantity: qtyEl ? parseInt(qtyEl.value) : 1,
      };
      addToCart(product);
    });

    var qtyInput = document.querySelector(".qty-input");
    var minusBtn = document.querySelector(".qty-btn:first-of-type");
    var plusBtn = document.querySelector(".qty-btn:last-of-type");

    if (qtyInput && minusBtn) {
      minusBtn.addEventListener("click", () => {
        var val = parseInt(qtyInput.value);
        if (val > 1) qtyInput.value = val - 1;
      });
    }

    if (qtyInput && plusBtn) {
      plusBtn.addEventListener("click", () => {
        var val = parseInt(qtyInput.value);
        qtyInput.value = val + 1;
      });
    }
  }
}

function setupCardButtons() {
  var cardButtons = document.querySelectorAll(".add-to-cart-card-btn");
  cardButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      var card = e.target.closest(".product-card");
      if (!card) return;
      var nameEl = card.querySelector(".product-name");
      var priceEl = card.querySelector(".current-price");
      var imgEl = card.querySelector(".product-img img");
      var product = {
        id: Date.now() + Math.random(),
        name: nameEl ? nameEl.innerText : "Product",
        price: priceEl ? parseFloat(priceEl.innerText.replace("$", "")) : 0,
        image: imgEl ? imgEl.src : "",
        quantity: 1,
      };
      addToCart(product);
    });
  });
}

function addToCart(product) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];

  var existingProductIndex = cart.findIndex(
    (item) => item.name === product.name
  );

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += product.quantity;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  alert("Product added to cart!");
}

function updateCartCount() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
}
function loadCart() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var tbody = document.querySelector(".cart-table tbody");
  tbody.innerHTML = "";

  if (cart.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" style="text-align:center; padding: 20px;">Your cart is empty.</td></tr>';
    updateTotals();
    return;
  }

  cart.forEach((item, index) => {
    var tr = document.createElement("tr");
    tr.innerHTML = `
            <td>
                <div class="cart-product-info">
                    <img src="${item.image}" alt="${
      item.name
    }" class="cart-product-img">
                    <span class="cart-product-name">${item.name}</span>
                </div>
            </td>
            <td class="cart-price">$${item.price.toFixed(2)}</td>
            <td>
                <div class="quantity-control" style="margin:0;">
                    <button class="qty-btn" onclick="updateCartQuantity(${index}, -1)" style="width: 25px; height: 25px; font-size: 14px;">-</button>
                    <input type="text" class="qty-input" value="${
                      item.quantity
                    }" readonly style="width: 35px; height: 25px; font-size: 14px;">
                    <button class="qty-btn" onclick="updateCartQuantity(${index}, 1)" style="width: 25px; height: 25px; font-size: 14px;">+</button>
                </div>
            </td>
            <td class="cart-price">$${(item.price * item.quantity).toFixed(
              2
            )}</td>
            <td><button class="cart-remove" onclick="removeFromCart(${index})">×</button></td>
        `;
    tbody.appendChild(tr);
  });

  updateTotals();
}

function updateCartQuantity(index, change) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    cart[index].quantity += change;
    if (cart[index].quantity < 1) cart[index].quantity = 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
  }
}

function removeFromCart(index) {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
  updateCartCount();
}

function updateTotals() {
  var cart = JSON.parse(localStorage.getItem("cart")) || [];
  var subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  var shipping = 0;
  var total = subtotal + shipping;

  var summaryRows = document.querySelectorAll(".summary-row span:last-child");
  if (summaryRows.length >= 2) {
    var rows = document.querySelectorAll(".summary-row");
    rows.forEach((row) => {
      var label = row.querySelector("span:first-child").innerText.toLowerCase();
      var valueSpan = row.querySelector("span:last-child");
      if (label.includes("subtotal")) {
        valueSpan.innerText = `$${subtotal.toFixed(2)}`;
      } else if (label.includes("total")) {
        valueSpan.innerText = `$${total.toFixed(2)}`;
      }
    });
  }
}

window.updateCartQuantity = updateCartQuantity;
window.removeFromCart = removeFromCart;

if (document.getElementById("min-price")) {
  var minSlider = document.getElementById("min-price");
  var minValDisplay = document.getElementById("min-price-val");
  var products = document.querySelectorAll(
    ".additional-products .product-card"
  );

  function filterProducts() {
    let minPrice = parseInt(minSlider.value);

    minValDisplay.innerText = minPrice;

    products.forEach((product) => {
      var price = parseFloat(product.getAttribute("data-price"));
      if (price >= minPrice) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });
  }

  minSlider.addEventListener("input", filterProducts);
}
