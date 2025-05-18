import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductList from "./ProductList";
import NewProductForm from "./NewProductForm";
import ProductDetail from "./ProductDetail";
import AddProduct from "./AddProduct";
import EditProductForm from "./EditProductForm";

const BACKEND_URL = window.REACT_APP_BACKEND_URL || "";

function ProductControl() {
  const [productList, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    console.log("Fetching products from backend...");
    axios
      .get(`${BACKEND_URL}/api/products`)
      .then((res) => {
        console.log("Fetched products:", res.data);
        setProductList(res.data);
      })
      .catch((err) => console.error("Failed fetching products:", err));
  }, []);

  // Handler: toggle Add New Product form
  const handleToggleForm = () => {
    // Reset states to ensure clean transitions
    setSelectedProduct(null);
    setIsEditing(false);
    setFormVisible((prev) => !prev);
  };

  // Handler: select product to view details
  const handleSelectProduct = (id) => {
    const product = productList.find((p) => p._id === id);
    if (product) {
      console.log("Selected product:", product);
      setSelectedProduct(product);
      setIsEditing(false);
      setFormVisible(false);
    }
  };

  // Handler: start editing selected product
  const handleStartEditing = () => {
    if (!selectedProduct) {
      console.warn("No product selected to edit");
      return;
    }
    console.log("Start editing product:", selectedProduct);
    setIsEditing(true);
    setFormVisible(false);
  };

  // Handler: add new product (POST)
  const handleAddProduct = (newProduct) => {
    console.log("Adding new product:", newProduct);
    axios
      .post(`${BACKEND_URL}/api/products`, newProduct)
      .then((res) => {
        console.log("Product added:", res.data);
        setProductList((prev) => [...prev, res.data]);
        setFormVisible(false);
      })
      .catch((err) => console.error("Failed adding product:", err));
  };

  // Handler: delete product (DELETE)
  const handleDeleteProduct = (id) => {
    console.log("Deleting product with id:", id);
    axios
      .delete(`${BACKEND_URL}/api/products/${id}`)
      .then(() => {
        console.log("Product deleted");
        setProductList((prev) => prev.filter((p) => p._id !== id));
        setSelectedProduct(null);
        setIsEditing(false);
        setFormVisible(false);
      })
      .catch((err) => console.error("Failed deleting product:", err));
  };

  // Handler: update product (PUT)
  const handleEditProduct = (editedProductData) => {
    if (!selectedProduct || !selectedProduct._id) {
      console.error("No selected product to update");
      return;
    }
    console.log("Editing product:", selectedProduct._id, editedProductData);
    axios
      .put(`${BACKEND_URL}/api/products/${selectedProduct._id}`, editedProductData, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        console.log("Product updated:", res.data);
        setProductList((prev) =>
          prev.map((p) => (p._id === selectedProduct._id ? res.data : p))
        );
        setSelectedProduct(null);
        setIsEditing(false);
        setFormVisible(false);
      })
      .catch((err) => console.error("Failed updating product:", err));
  };

  // Handle "Buy" button — decrease quantity by 1 if available
  const handleBuyProduct = (id) => {
    const product = productList.find((p) => p._id === id);
    if (!product) {
      console.warn("Product to buy not found");
      return;
    }
    if (typeof product.quantity !== "number" || product.quantity <= 0) {
      alert("Product is not available");
      return;
    }
    const updatedQuantity = product.quantity - 1;
    console.log(`Buying product ${id}, new quantity: ${updatedQuantity}`);

    // Immediately update frontend state for better UX
    const updatedProduct = { ...product, quantity: updatedQuantity };
    setProductList((prev) =>
      prev.map((p) => (p._id === id ? updatedProduct : p))
    );
    setSelectedProduct(updatedProduct);

    // Also sync update to backend via PUT
    handleEditProduct({
      name: updatedProduct.name,
      price: updatedProduct.price,
      description: updatedProduct.description,
      quantity: updatedQuantity,
    });
  };

  // Decide which component to show
  let content = null;
  let buttonText = null;

  if (isEditing) {
    content = (
      <EditProductForm
        product={selectedProduct}
        onEditProduct={handleEditProduct}
      />
    );
    buttonText = "Back to Product Detail";
  } else if (selectedProduct) {
    content = (
      <ProductDetail
        product={selectedProduct}
        onBuyButtonClick={handleBuyProduct}
        onDeleteProduct={handleDeleteProduct}
        onEditProductClick={handleStartEditing}
      />
    );
    buttonText = "Back to Product List";
  } else if (formVisible) {
    content = <NewProductForm onNewProductCreation={handleAddProduct} />;
    buttonText = "Back to Product List";
  } else {
    content = (
      <ProductList
        productList={productList}
        onProductSelection={handleSelectProduct}
      />
    );
    buttonText = "Add a Product";
  }

  return (
    <>
      <AddProduct buttonText={buttonText} whenButtonClicked={handleToggleForm} />
      {content}
    </>
  );
}

export default ProductControl;
