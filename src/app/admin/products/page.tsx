"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import axios from "axios";

// Define types for Product and Mutation History
interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  mutationLedger: Mutation[];
}

interface Mutation {
  timestamp: string;
  change: number;
  reason: string;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<Product[]>("http://localhost:8080/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Handle adding or editing a product
  const handleSaveProduct = async (product: Product) => {
    try {
      if (product.id) {
        // Update product
        await axios.put(`http://localhost:8080/products/${product.id}`, product);
      } else {
        // Add new product
        await axios.post("http://localhost:8080/products", product);
      }
      setModalOpen(false);
      setSelectedProduct(null);

      // Refresh product list
      const response = await axios.get<Product[]>("http://localhost:8080/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  // Handle stock mutation
  const handleStockMutation = async (productId: string, change: number, reason: string) => {
    try {
      await axios.post(`http://localhost:8080/products/${productId}/mutate-stock`, { change, reason });
      // Refresh product list
      const response = await axios.get<Product[]>("http://localhost:8080/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error mutating stock:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Warehouse Products</h1>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setSelectedProduct(null);
            setModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Category</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                <td className="border border-gray-300 px-4 py-2">{product.categoryId}</td>
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">${product.price.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button
                    size="sm"
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedProduct(product);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 ml-2"
                    onClick={() => handleStockMutation(product.id, -1, "Remove 1 item")}
                  >
                    Decrease Stock
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalHeader>{selectedProduct ? "Edit Product" : "Add Product"}</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={selectedProduct?.name || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, name: e.target.value } as Product)
              }
            />
            <Input
              label="Price"
              type="number"
              value={selectedProduct?.price || ""}
              onChange={(e) =>
                setSelectedProduct({ ...selectedProduct, price: parseFloat(e.target.value) } as Product)
              }
            />
            {/* Add fields for category, description, etc. */}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleSaveProduct(selectedProduct as Product)}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default ProductManagement;
