const express = require('express')
const cors = require('cors');
const mysqlPromise = require('mysql2/promise');

// Create the connection pool. The pool-specific settings are the defaults
const pool = mysqlPromise.createPool({
  host: '',
  user: '',
  database: 'store',
  password: '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const app = express()
const port =  3001

app.use(cors({
    origin: '*'
}));

app.get('/', async function(req, res) {
    res.send(JSON.stringify({error:"403 Forbidden"}))
})

app.get('/loginUser', async function(req, res) {
  const [rows, fields] = await pool.execute('call ValidateCredentials(?, ?)', [req.query.email, req.query.password]);
  res.send(JSON.stringify(rows[0][0]))
})
app.get('/getShoppingList', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetShoppingList(?)', [req.query.id]);
  res.send(JSON.stringify(rows[0]))
})

app.get('/addToList', async function(req, res) {
  const [rows, fields] = await pool.execute('INSERT INTO ShoppingItems (People_ID, UPC, Quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE Quantity = Quantity + ?;', 
  [req.query.id, req.query.upc, req.query.quantity, req.query.quantity]);
  res.send("ok")
})

app.get('/removeFromList', async function(req, res) {
  const [rows, fields] = await pool.execute('DELETE FROM ShoppingItems WHERE People_ID=? AND UPC=?', 
  [req.query.id, req.query.upc]);
  console.log(rows)
  console.log(req.query.id)
  console.log(req.query.upc)
  res.send("{\"response\":\"ok\"}")
})

app.get('/productByUpc/:upc', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetProductByUPC(?)', [req.params.upc]);
  res.send(JSON.stringify(rows))
})
app.get('/productWithImagesByUpc/:upc', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetProductByUPCWithImages(?)', [req.params.upc]);
  res.send(JSON.stringify(rows))
})
app.get('/allProducts', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetAllProducts()');
  res.send(JSON.stringify(rows))
})
app.get('/allProductsWithImages', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetAllProductsWithImages()');
  res.send(JSON.stringify(rows))
})
app.get('/deptProducts/:id', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetDepartmentProducts(?)', [req.params.id]);
  res.send(JSON.stringify(rows))
})
app.get('/deptProductsWithImages/:id', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetDepartmentProductsWithImages(?)', [req.params.id]);
  res.send(JSON.stringify(rows))
})
app.get('/departments', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetAllDepartments()');
  res.send(JSON.stringify(rows))
})
app.get('/getProductDemandReport', async function(req, res) {
  const [rows, fields] = await pool.execute('call GetProductDemand()');
  res.send(JSON.stringify(rows[0]))
})

app.get('/addProduct', async function(req, res) {
  const [rows, fields] = await pool.execute('insert into Products (UPC, Department_ID, Name, Description, Price, Quantity_Available, Size, Size_Unit) values (?,?,?,?,?,?,?);', 
      [req.query.upc, req.query.deptId, req.query.name, req.query.desc, req.query.price, req.query.quan, req.query.size, req.query.size_units]);
  res.send(JSON.stringify(rows[0]))
})

app.get('/addProductImage', async function(req, res) {
  const [rows, fields] = await pool.execute('insert into ProductImages (UPC, Data, Description) values (?,?,?);', 
      [req.query.upc, req.query.data, req.query.desc]);
  res.send(JSON.stringify(rows[0]))
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})