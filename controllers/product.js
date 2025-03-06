import { Product } from "../models/product.js";

//  Add a new item
export const addProduct = async (req, res, next) => {
    try {
        const {  name, category, salesPrice, costPrice, quantity, image, discount } = req.body;

        if (!shopId || !name || !category || !salesPrice || !costPrice || !quantity || !image) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const shopId = req.id;
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

        res.json({ success: true, message: "Prduct updated successfully", product: updatedProduct });
    } catch (error) {
       next(error)
    }
};

// Delete an item
export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
       next(error)
    }
};
