const asyncHandler = require("../middleware/asyncHandler");
const products = require("../model/productModel");


// @desc  fetch all products
// @route GET/api/products
// @access Public
exports.getProducts = asyncHandler(async(req,res) => {
  const searchData = req.query.search;
  const allProducts = await products.find({name:{$regex:searchData, $options:"i"}});
  res.json(allProducts);
})

// @desc  fetch men products
// @route GET/api/products/men
// @access Public
exports.getMenProducts = asyncHandler(async(req,res) => {
  const allProducts = await products.find({category:"Men"});
  res.json(allProducts);
})

// @desc  fetch women products
// @route GET/api/products/women
// @access Public
exports.getWomenProducts = asyncHandler(async(req,res) => {
  const allProducts = await products.find({category:"Women"});
  res.json(allProducts);
})

// @desc  fetch top rated products
// @route GET/api/products/top-rated
// @access Public
exports.getTopRatedProducts = asyncHandler(async(req,res) => {
  const allProducts = await products.find().sort({rating:-1}).limit(5);
  res.json(allProducts);
});

// @desc  fetch featured products
// @route GET/api/products/featured
// @access Public
exports.getFeaturedProducts = asyncHandler(async(req,res) => {
  const allProducts = await products.find().limit(5);
  res.json(allProducts);
});

// @desc  Fetch products with a rating of 5 in their reviews
// @route GET /api/products/review
// @access Public
exports.getReviews = asyncHandler(async (req, res) => {
  const productsWithFiveStarReviews = await products.aggregate([
    { $match: { "reviews.rating": 5 } },
    { $unwind: "$reviews" },
    { $match: { "reviews.rating": 5 } },
    { $group: { _id: "$_id", reviews: { $push: "$reviews" } } },
    { $project: { reviews: 1 } },
    { $limit: 4 }
  ]);
  res.json(productsWithFiveStarReviews);
});



// @desc  fetch products by id
// @route GET/api/products/:id
// @access Public
exports.getProductById = asyncHandler(async(req,res) => {
  const singleProduct = await products.findById(req.params.id);
  if(singleProduct){
   return res.json(singleProduct);
  }
  else{
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc  create a product
// @route POST /api/products
// @access Private/Admin
exports.createProduct = asyncHandler(async(req,res) => {
  const product = new products({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc  add a product
// @route POST /api/products/add
// @access Private/Admin
exports.addProduct = asyncHandler(async(req,res) => {

  const {name, price, image, brand, category, countInStock, description} = req.body;

  const product = new products({
    name,
    price,
    user: req.user._id,
    image,
    brand,
    category,
    countInStock,
    rating: 0,
    numReviews: 0,
    description,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});


// @desc  Update a product
// @route PUT/api/products/:id
// @access Private/Admin
exports.updateProduct = asyncHandler(async(req,res) => {
  const {name, price, description, image, brand, category, countInStock } = req.body;

  const product = await products.findById(req.params.id);
  if(product){
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
})


// @desc  Delete a product
// @route DELETE/api/products/:id
// @access Private/Admin
exports.deleteProduct = asyncHandler(async(req,res) => {

  const product = await products.findById(req.params.id);
  if(product){
   await products.deleteOne({_id: product._id});
   res.status(200).json({ message: 'Product deleted'});
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
})


// @desc create a new review
// @route POST /api/products/:id/reviews
// @access Private
exports.createProductReview = asyncHandler(async(req,res) => {

  const { rating, comment } = req.body;

  const product = await products.findById(req.params.id);

  if(product){
    const alreadyReviewed = product.reviews.find((review)=> review.user.toString() === req.user._id.toString());

    if(alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });

  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});