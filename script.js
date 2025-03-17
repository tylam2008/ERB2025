// Sample product data
const products = [
  { id: 1, item: "Laptop", price: 1200, category: "electronics", image: "laptop.jpg" },
  { id: 2, item: "T-Shirt", price: 25, category: "clothing", image: "tshirt.jpg" },
  { id: 3, item: "JavaScript Book", price: 45, category: "books", image: "jsbook.jpg" },
  { id: 4, item: "Smartphone", price: 800, category: "electronics", image: "smartphone.jpg" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Display products based on category
function displayProducts(category = "all") {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";
  const filteredProducts = category === "all" ? products : products.filter(p => p.category === category);
  filteredProducts.forEach(product => {
    productList.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card">
          <img src="${product.image}" class="card-img-top" alt="${product.item}">
          <div class="card-body">
            <h5 class="card-title">${product.item}</h5>
            <p class="card-text">$${product.price}</p>
            <button onclick="addToCart(${product.id})" class="btn btn-primary">Add to Cart</button>
          </div>
        </div>
      </div>
    `;
  });
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const cartItem = cart.find(item => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartCount();
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Display cart items
function displayCartItems() {
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    const amount = item.price * item.quantity;
    total += amount;
    cartItems.innerHTML += `
      <div class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">${item.item}</h5>
          <p class="card-text">$${item.price} x ${item.quantity} = $${amount}</p>
          <button onclick="updateQuantity(${item.id}, -1)" class="btn btn-warning">-</button>
          <button onclick="updateQuantity(${item.id}, 1)" class="btn btn-success">+</button>
          <button onclick="removeItem(${item.id})" class="btn btn-danger">Remove</button>
        </div>
      </div>
    `;
  });
  cartItems.innerHTML += `<h3 class="text-end">Grand Total: $${total}</h3>`;
}

// Update item quantity
function updateQuantity(productId, change) {
  const cartItem = cart.find(item => item.id === productId);
  cartItem.quantity += change;
  if (cartItem.quantity <= 0) {
    cart = cart.filter(item => item.id !== productId);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

// Remove item from cart
function removeItem(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCartItems();
  updateCartCount();
}

// Confirm order
function confirmOrder() {
  document.getElementById("payment-details").style.display = "block";
  document.getElementById("confirm-order").style.display = "none";
}

// Place order
function placeOrder() {
  alert("Order placed successfully!");
  cart = [];
  localStorage.removeItem("cart");
  updateCartCount();
}

// Event listeners
document.getElementById("search").addEventListener("click", () => {
  const category = document.getElementById("category").value;
  displayProducts(category);
});

document.getElementById("confirm-order").addEventListener("click", confirmOrder);

document.getElementById("payment-form").addEventListener("submit", (e) => {
  e.preventDefault();
  placeOrder();
});

// Initial load
if (window.location.pathname.endsWith("index.html")) {
  displayProducts();
  updateCartCount();
} else if (window.location.pathname.endsWith("cart.html")) {
  displayCartItems();
}