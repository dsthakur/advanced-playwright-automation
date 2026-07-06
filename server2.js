const http = require('http');
const PORT = 3002;
let cart = [];
const server = http.createServer((req, res) => {
 if (req.url === '/products') {
   res.writeHead(200, { 'Content-Type': 'text/html' });
   return res.end(`
<html>
<body>
<h1>Products</h1>
<button class="add-to-cart">Add to Cart</button>
<p id="msg"></p>
<script>
         document.querySelector('.add-to-cart').addEventListener('click', async () => {
           await fetch('/api/cart/add', { method: 'POST' });
           document.getElementById('msg').innerText = 'backpack added to cart!';
         });
</script>
</body>
</html>
   `);
 }
 if (req.method === 'POST' && req.url === '/api/cart/add') {
   cart.push('backpack');
   res.writeHead(200, { 'Content-Type': 'application/json' });
   return res.end(JSON.stringify({ success: true }));
 }
 if (req.url === '/cart') {
   res.writeHead(200, { 'Content-Type': 'text/html' });
   return res.end(`
<html>
<body>
<h1>Your Cart</h1>
<div id="cart-count">${cart.length} item</div>
       ${cart.map(item => `<div class="cart_item">${item}</div>`).join('')}
</body>
</html>
   `);
 }
 res.writeHead(404);
 res.end('Not Found');
});
server.listen(PORT, () => {
 console.log('Local Shop running at http://localhost:' + PORT);
});