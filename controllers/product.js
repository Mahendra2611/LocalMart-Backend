import mongoose from "mongoose";
import { Product } from "../models/product.js";

//  Add a new item
export const addProduct = async (req, res, next) => {
    try {
        const {  name, category, salesPrice, costPrice, quantity, image, discount } = req.body;
        const {shopId} = req.params;
        if (!shopId || !name || !category || !salesPrice || !costPrice || !quantity || !image) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
       
        const offerPrice = discount > 0 ? salesPrice - (salesPrice * discount / 100) : salesPrice;

        const newProduct = new Product({
            shopId,
            name,
            category,
            salesPrice,
            costPrice,
            quantity,
            image,
            discount,
            offerPrice,
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, message: "Product added successfully", product: savedProduct });
    } catch (error) {
        next(error);
    }
};




//  Update an existing item
export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, category, salesPrice, costPrice, quantity, image, discount } = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                category,
                salesPrice,
                costPrice,
                quantity,
                image,
                discount,
                offerPrice: discount > 0 ? salesPrice - (salesPrice * discount / 100) : salesPrice,
            },
            { new: true } // Return updated item
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Prduct updated successfully", product: updatedProduct });
    } catch (error) {
       next(error)
    }
};

// Delete an item
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log("delete")
        const deletedProduct = await Product.findByIdAndDelete(productId);
        console.log(deletedProduct)
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        //console.log(error)
       next(error)
    }
};

export const getProducts = async (req, res) => {
    try {
      const { shopId } = req.params;
      const products = await Product.find({ shopId });
  
      if (!products.length) {
        return res.status(404).json({ message: "No products found for this shop." });
      }
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products", error: error.message });
    }
  };
 



//   abh added 
 
export const getShopItemsByCategory = async (req, res) => {
  try {
      const { shopId } = req.params;
      const { category } = req.query;
    //   console.log(shopId)

    // Find products by shopId and category
    const products = await Product.find({ shopId, category });

    if (!products.length) {
      return res.status(404).json({ success: false, message: "No products found for this category in the shop" });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

 // Get products whose quantity is below the alert level

export const getLowStockProducts = async (req, res) => { 
    try {
        const { shopId } = req.params;
        const shopid = new mongoose.Types.ObjectId(shopId);

        console.log(shopId);

        // Use $expr to compare two fields (quantity and lowStockThreshold)
        const lowStockProducts = await Product.find({ 
            shopId: shopid, 
            $expr: { $lt: ["$quantity", "$lowStockThreshold"] } // Compare quantity < lowStockThreshold
        });

        console.log(lowStockProducts);
        res.status(200).json(lowStockProducts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching low stock products", error });
    }
};

  
  // Update product quantities
  export const updateProductQuantities = async (req, res) => {
    try {
      const { products } = req.body;
  
      if (!products || products.length === 0) {
        return res.status(400).json({ message: "No products provided for update" });
      }
  
      // Prepare bulk operations
      const bulkOperations = products.map((product) => ({
        updateOne: {
          filter: { _id: product._id },
          update: { $set: { quantity: product.newQuantity } },
        },
      }));
  
      // Perform bulk write operation
      const result = await Product.bulkWrite(bulkOperations);
  
      res.status(200).json({ message: "Product quantities updated successfully", result });
    } catch (error) {
      res.status(500).json({ message: "Error updating quantities", error });
    }
  };

