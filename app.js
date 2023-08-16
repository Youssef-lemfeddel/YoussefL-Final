const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost/juice_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Order = mongoose.model('Order', {
  name: String,
  phoneNumber: String,
  juices: [
    {
      type: String,
      enum: ['Lichi', 'Beet', 'Peach']
    }
  ]
});

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/place-order', async (req, res) => {
  const { name, phoneNumber, juices } = req.body;
  const order = new Order({ name, phoneNumber, juices });
  await order.save();

  res.render('order', { order });
});

app.get('/view-orders', async (req, res) => {
  const orders = await Order.find();
  res.render('orders', { orders });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
