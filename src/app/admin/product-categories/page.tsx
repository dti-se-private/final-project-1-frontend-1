"use client";
import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Button, Input, Modal, ModalBody, ModalFooter, ModalHeader } from "@heroui/react";
import axios from "axios";

// Define type for Category
interface Category {
  id: string;
  name: string;
  description: string;
}

const WarehouseCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:8080/product-categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Handle adding or editing a category
  const handleSaveCategory = async (category: Category) => {
    try {
      if (category.id) {
        // Update category
        await axios.put(`http://localhost:8080/product-categories/${category.id}`, category);
      } else {
        // Add new category
        await axios.post("http://localhost:8080/product-categories", category);
      }
      setModalOpen(false);
      setSelectedCategory(null);

      // Refresh category list
      const response = await axios.get<Category[]>("http://localhost:8080/product-categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Warehouse Categories</h1>
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => {
            setSelectedCategory(null);
            setModalOpen(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{category.id}</td>
                <td className="border border-gray-300 px-4 py-2">{category.name}</td>
                <td className="border border-gray-300 px-4 py-2">{category.description}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <Button
                    size="sm"
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelectedCategory(category);
                      setModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalHeader>{selectedCategory ? "Edit Category" : "Add Category"}</ModalHeader>
          <ModalBody>
            <Input
              label="Name"
              value={selectedCategory?.name || ""}
              onChange={(e) =>
                setSelectedCategory({ ...selectedCategory, name: e.target.value } as Category)
              }
            />
            <Input
              label="Description"
              value={selectedCategory?.description || ""}
              onChange={(e) =>
                setSelectedCategory({ ...selectedCategory, description: e.target.value } as Category)
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleSaveCategory(selectedCategory as Category)}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
      )}
    </div>
  );
};

export default WarehouseCategories;
