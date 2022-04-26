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
const port =  3000

app.use(cors({
    origin: '*'
}));

app.get('/', async function(req, res) {
    res.send(JSON.stringify({error:"403 Forbidden"}))
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})