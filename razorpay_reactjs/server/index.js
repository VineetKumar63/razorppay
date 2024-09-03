require('dotenv').config()
const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const Razorpay = require("razorpay");

app.post('/order', async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id:process.env.RAZORPAY_KEY_ID,
      key_secret:process.env.RAZORPAY_SECRET
    })
    const options = req.body;
    const order = await razorpay.orders.create(options);
    if(!order){
      return res.status(400).json("error in creating order")
    }
    res.json(order)
    
  } catch (error) {
    return res.status(500).json({error})
  }
})


app.post('/order/validate',async (req, res) =>{
  const{razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body
  console.log(req.body)
  const sha = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET)
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex")
  if(digest !== razorpay_signature){
    return res.status(400).send("Invalid Transaction");  }
  res.json({
    msg:'payment successfull',
    orderId:razorpay_order_id,
    paymentId:razorpay_payment_id
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
