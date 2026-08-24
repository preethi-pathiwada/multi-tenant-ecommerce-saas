import Store from "../models/Store.js"
import Product from "../models/Product.js"

export const createProduct = async (req, res) => {
    try{
        const {name, description, price, stock, images, variants} = req.body

        if (!name || price === undefined || stock === undefined){
            return res.status(400).json({
                message:"Name, price and stock are required."
            })
        }

        const store = await Store.findOne({
            owner: req.user._id
        })

        if(!store){
            return res.status(404).json({
                message:"Store not found"
            })
        }

        const isProductExist = await Product.findOne({
            name, 
            description,
            price,
            store: store._id
        })

        if(isProductExist){
            return res.status(400).json({
                message:"Product already exists"
            })

        }
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            images: images || [],
            store: store._id,
            variants:variants || []
        })
        
        res.status(200).json({
            message: "Product created successfully",
            product,
        })
    }
    catch(error){
        res.status(500).json({
            message:"Cannot create Product",
            error: error.message
        })
    }
}


export const getMyProducts = async (req, res) => {
  try {
    const store = await Store.findOne({
      owner: req.user._id,
    });

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const products = await Product.find({
      store: store._id,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products",
      error: error.message,
    });
  }
};

export const getStoreProducts = async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findById(storeId);

    console.log(store)

    if (!store) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const products = await Product.find({
      store: storeId,
    });

    res.status(200).json({
      products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get store products",
      error: error.message,
    });
  }
};


export const updateProduct = async (req, res) => {
  try{
    const {name, description, price, stock, images, variants} = req.body;

    const {productId} = req.params

    const store = await Store.findOne({owner: req.user._id})

    if(!store){
      return res.status(404).json({
        message:"Store not found"
      })
    }

    const product = await Product.findOne({
      _id: productId,
      store: store._id
    })

    if(!product){
      return res.status(404).json({
        message:"Product not found"
      })
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock= stock ?? product.stock;
    product.images = images ?? product.images;
    product.variants = variants ?? product.variants;

    await product.save();

    res.status(200).json({
      message:"Product updated successfully",
      product
    })

  }
  catch(error){
    res.status(500).json({
      message:"Failed to update the product",
      error: error.message
    })
  }
};


export const deleteProduct = async (req, res) => {
  try{

    const {productId} = req.params

    const store = await Store.findOne({owner: req.user._id})

    if(!store){
      return res.status(404).json({
        message:"Store not found"
      })
    }

    const product = await Product.findOne({
      _id: productId,
      store: store._id
    })

    if(!product){
      return res.status(404).json({
        message:"Product not found"
      })
    }

    await product.deleteOne();

    res.status(200).json({
      message:"Product deleted successfully"
    })

  }
  catch(error){
    res.status(500).json({
      message:"Failed to delete the product",
      error: error.message
    })
  }
};

