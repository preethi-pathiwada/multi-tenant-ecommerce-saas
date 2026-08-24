import Store from "../models/Store.js";

export const createStore = async (req, res) => {
  try {
    const { name, slug } = req.body;


    if (!name || !slug) {
      return res.status(400).json({
        message: "Store name and slug are required",
      });
    }

   
    const existingStore = await Store.findOne({
      owner: req.user._id,
    });

    if (existingStore) {
      return res.status(400).json({
        message: "You already have a store",
      });
    }

    
    const slugExists = await Store.findOne({
      slug: slug.toLowerCase(),
    });

    if (slugExists) {
      return res.status(400).json({
        message: "Store slug already exists",
      });
    }

    
    const store = await Store.create({
      name,
      slug: slug.toLowerCase(),
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Store created successfully",
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create store",
      error: error.message,
    });
  }
};

export const getMyStore = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found"
      });
    }

    res.status(200).json({
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get store",
      error: error.message,
    });
  }
};


export const getStoreBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const store = await Store.findOne({
      slug: slug.toLowerCase(),
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    res.status(200).json({
      store,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get store",
      error: error.message,
    });
  }
};