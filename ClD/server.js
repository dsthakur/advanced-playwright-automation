const http = require('http');

const PORT = 3000;

const pages = {
  '/': `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Local Shop</title></head>
    <body>
      <h1>Local Shop</h1>
      <nav>
        <a href="/products" id="nav-products">Products</a>
        <a href="/cart" id="nav-cart">Cart <span id="cart-count">0</span></a>
      </nav>
      <form id="login-form">
        <label for="username">Username</label>
        <input id="username" type="text" placeholder="Enter username" />
        <label for="password">Password</label>
        <input id="password" type="password" placeholder="Enter password" />
        <button type="submit" id="login-btn">Login</button>
      </form>
    </body>
    </html>`,

  '/products': `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Products - Local Shop</title></head>
    <body>
      <h1>Products</h1>
      <ul id="product-list">
        <li class="product-item" data-id="1">
          <span class="product-name">Backpack</span>
          <span class="product-price">$29.99</span>
          <button class="add-to-cart" data-product="backpack">Add to Cart</button>
        </li>
        <li class="product-item" data-id="2">
          <span class="product-name">Bike Light</span>
          <span class="product-price">$9.99</span>
          <button class="add-to-cart" data-product="bike-light">Add to Cart</button>
        </li>
        <li class="product-item" data-id="3">
          <span class="product-name">Bolt T-Shirt</span>
          <span class="product-price">$15.99</span>
          <button class="add-to-cart" data-product="tshirt">Add to Cart</button>
        </li>
      </ul>
      <a href="/">Back to Home</a>
    </body>
    </html>`,

  '/cart': `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Cart - Local Shop</title></head>
    <body>
      <h1>Your Cart</h1>
      <p id="empty-msg">Your cart is empty.</p>
      <button id="checkout-btn">Proceed to Checkout</button>
      <a href="/products">Continue Shopping</a>
    </body>
    </html>`,

  '/checkout': `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Checkout - Local Shop</title></head>
    <body>
      <h1>Checkout</h1>
      <form id="checkout-form">
        <label for="first-name">First Name</label>
        <input id="first-name" type="text" />
        <label for="last-name">Last Name</label>
        <input id="last-name" type="text" />
        <label for="postal">Postal Code</label>
        <input id="postal" type="text" />
        <button type="submit" id="place-order-btn">Place Order</button>
      </form>
    </body>
    </html>`,

  '/order-confirmed': `
    <!DOCTYPE html>
    <html lang="en">
    <head><title>Order Confirmed - Local Shop</title></head>
    <body>
      <h1>Thank you for your order!</h1>
      <p id="confirm-msg">Your order has been placed successfully.</p>
      <a href="/products">Continue Shopping</a>
    </body>
    </html>`,
};

const server = http.createServer((req, res) => {
  const html = pages[req.url] || `<h1>404 - Page not found</h1>`;
  res.writeHead(html.includes('404') ? 404 : 200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(PORT, () => {
  console.log(`Local Shop running at http://localhost:${PORT}`);
});