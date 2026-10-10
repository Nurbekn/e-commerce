const searchInput = document.getElementById("search");
const filters = document.getElementById("filters");
const sortSelect = document.getElementById("sort");
const productGrid = document.getElementById("product-grid");
const resultCount = document.getElementById("result-count");
const emptyState = document.getElementById("empty-state");
const resetFiltersBtn = document.getElementById("reset-filters");
const productTemplate = document.getElementById("product-template");
const cartCount = document.getElementById("cart-count");
const cartItemTemplate = document.getElementById("cart-item-template");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");
const cartPanel = document.getElementById("cart");
const cartToggle = document.getElementById("cart-toggle");
const cartClose = document.getElementById("cart-close");
const overlay = document.getElementById("overlay");
const errorMessage = document.getElementById("error-message");
const retryBtn = document.getElementById("retry-btn");

let products = [];
console.log(products);
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let activeCategory = "all";
let searchQuery = "";

function renderProducts() {
  productGrid.innerHTML = "";
  const filteredProducts = products.filter((product) => {
    return product.title.toLowerCase().includes(searchQuery);
  });
  if(sortSelect.value==="price-asc"){
    filteredProducts.sort((a,b)=>a.price-b.price);
  }
  else if (sortSelect.value==="price-desc") {
    filteredProducts.sort((a,b)=>b.price-a.price);
  }
  else if(sortSelect.value==="name-asc"){
    filteredProducts.sort((a,b)=>a.title.localeCompare(b.title));
  }

  sortSelect.addEventListener("change",()=>{
    renderProducts()
  })
  filteredProducts.forEach((product) => {
    const card = productTemplate.content.cloneNode(true);
    card.querySelector(".card__title").textContent = product.title;
    card.querySelector(".card__price").textContent = product.price + "$";
    card.querySelector(".card__category").textContent = product.category;
    card.querySelector(".card__img").src = product.image;
    const addButton = card.querySelector(".card__add");
    addButton.addEventListener("click", () => {
      const existingItem = cart.find((item) => item.id === product.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      if (!existingItem) {
        cart.push({ ...product, quantity: 1 });
      }
      cartCount.textContent = cart.length;
      renderCart();
    });
    productGrid.append(card);
  });
}
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value.trim().toLowerCase();
  renderProducts();
  products = filteredProducts;
  renderProducts();
});
function renderCart() {
  cartItems.innerHTML = "";
  document.getElementById("cart-empty").hidden = cart.length > 0;
  cart.forEach((product) => {
    const item = cartItemTemplate.content.cloneNode(true);
    item.querySelector(".cart-item__title").textContent = product.title;
    item.querySelector(".cart-item__price").textContent = product.price + "$";
    item.querySelector(".cart-item__img").src = product.image;
    item.querySelector(".qty__value").textContent = product.quantity;
    const inc = item.querySelector('[data-action="inc"]');
    const dec = item.querySelector('[data-action="dec"]');
    const removeBtn = item.querySelector('[data-action="remove"]');
    removeBtn.addEventListener("click", () => {
      cart = cart.filter((item) => item.id !== product.id);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    cartItems.append(item);

    inc.addEventListener("click", () => {
      product.quantity++;
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });

    dec.addEventListener("click", () => {
      if (product.quantity > 1) {
        product.quantity--;
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCart();
    });
  });
  const totalPrice = cart.reduce((sum, product) => {
    return sum + product.price * product.quantity;
  }, 0);
  cartTotal.textContent = "$" + totalPrice.toFixed(2);
  cartCount.textContent = cart.reduce((sum, item) => {
    return sum + item.quantity;
  }, 0);
}
clearCartBtn.addEventListener("click", () => {
  cart = [];
  renderCart();
});
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    window.alert("Your cart is empty");
  }

  if (confirm("Confirm your order?")) {
    cart = [];
    renderCart();
    alert("Order placed successfully");
  }
});

async function loadProducts() {
  const url = "https://fakestoreapi.com/products";
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Open Fetch Error ");
    }
    const data = await response.json();
    products = data;
    renderProducts();
  } catch (error) {
    console.error("Server error", error);

    productGrid.innerHTML = "";
    emptyState.textContent = "Unable to load products.Please try again";
    emptyState.hidden = true;
    errorMessage.hidden = false;
  }
}
retryBtn.addEventListener("click", () => {
  errorMessage.hidden = true;
  loadProducts();
});
loadProducts();
renderCart();

cartToggle.addEventListener("click", () => {
  cartPanel.classList.add("is-open");
});

cartClose.addEventListener("click", () => {
  cartPanel.classList.remove("is-open");
});
