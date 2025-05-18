const express = require('express');
const router = express.Router();

// Product Model
const Product = require('../../models/Products');

// @route GET /products
// @desc Get ALL products
router.get('/', (req, res) => {
  // Fetch all products from database
  Product.find({}, (error, products) => {
    if (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Error fetching products' });
    } else {
      res.json(products);
    }
  });
});

// @route POST /products
// @desc Create a product
router.post('/', (req, res) => {
  // Create a product item
  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  newProduct.save((err, product) => {
    if (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Error creating product' });
    } else {
      res.json(product);  // Send the created product back to the client
    }
  });
});

// @route PUT api/products/:id
// @desc Update a product
router.put('/:id', async (req, res) => {
  console.log(`Received PUT request for product ID: ${req.params.id}`);
  console.log('Request body:', req.body);

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        quantity: req.body.quantity,
        photo: req.body.photo,
      },
      { new: true }
    );

    if (!updatedProduct) {
      console.log('Product not found for ID:', req.params.id);
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    console.log('Product updated successfully:', updatedProduct);
    res.json(updatedProduct);
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).json({ success: false, message: 'Error updating product' });
  }
});




// @route DELETE api/products/:id
// @desc Delete a product
router.delete('/:id', (req, res) => {
  // Delete a product from the database
  Product.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      console.log(err);
      res.json({ success: false, message: 'Error deleting product' });
    } else {
      res.json({ success: true });
    }
  });
});

module.exports = router;
