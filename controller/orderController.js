const asyncHandler = require("../middleware/asyncHandler");
const orders = require("../model/orderModel");


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports. addOrderItems = asyncHandler(async(req,res)=>{
  const { 
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
   } = req.body;

   if(orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error('No order items');
   } else {
      const order = new orders({
        orderItems : orderItems.map((x)=>({
          ...x, 
          product: x._id,
          _id: undefined
        })),
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createOrder = await order.save();

      res.status(201).json(createOrder);
   }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports. getMyOrders = asyncHandler(async(req,res)=>{
  const orderList = await orders.find({ user: req.user._id });
  res.status(200).json(orderList);
});

// @desc    Get order by Id
// @route   GET /api/orders/:id
// @access  Private
exports. getOrderById = asyncHandler(async(req,res)=>{
  const order = await orders.findById(req.params.id).populate('user', 'name email');

  if(order) {
    res.status(200).json(order);
  } else{
    res.status(404);
    throw new Error('order not found');
  }

});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
exports. updateOrderToPaid = asyncHandler(async(req,res)=>{
  const order = await orders.findById(req.params.id);
  if(order){
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    }

    const updatedOrder = await order.save();
    
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
exports. updateOrderToDelivered = asyncHandler(async(req,res)=>{
  const order = await orders.findById(req.params.id);

  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports. getOrders = asyncHandler(async(req,res)=>{
  const orderList = await orders.find({}).populate('user', 'id name');
  res.status(200).json(orderList);
});






