const express = require('express');
const { getProductById, getProducts, createProduct, updateProduct, deleteProduct, addProduct, createProductReview, getMenProducts, getWomenProducts, getTopRatedProducts, getFeaturedProducts, getReviews } = require('../controller/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();


router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/men').get(getMenProducts);
router.route('/women').get(getWomenProducts);
router.route('/top-rated').get(getTopRatedProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/reviews').get(getReviews);

router.route('/add').post(protect, admin, addProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);





module.exports = router;