import { Owner } from '../models/owner.js';

export const getAllShops = async (req, res) => {
  try { 
    const owners = await Owner.find();
    res.status(200).json({ 
        success: true,
        message:"All Shops are Fetched Successfully",
         data: owners });
  } catch (error) {
    console.error('Error fetching owners:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


export const getShopDetails = async (req, res) => {
    try {
      const { shopId } = req.params;
      // console.log(shopId)
      
      // Find the shop by ID
      const shop = await Owner.findById(shopId);
      
      if (!shop) {
        return res.status(404).json({ success: false, message: "Shop not found" });
      }
      
      res.status(200).json({ success: true, data: shop });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  };
