

import mongoose from "mongoose";

import Store from "../models/Store.js";
import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/uploadToCloudinary.js";


// =====================================================
// CREATE PRODUCT
// =====================================================

export const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            stock,
            variants
        } = req.body;

        // 1. Validate required fields
        if (!name || price === undefined || stock === undefined) {
            return res.status(400).json({
                message: "Name, price and stock are required."
            });
        }

        // 2. Find the logged-in vendor's store
        const store = await Store.findOne({
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // 3. Check whether the product already exists
        const isProductExist = await Product.findOne({
            name,
            description,
            price,
            store: store._id
        });

        if (isProductExist) {
            return res.status(400).json({
                message: "Product already exists"
            });
        }

        // 4. Upload images to Cloudinary
        const imageUrls = [];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    `products/${store._id}`
                );

                imageUrls.push(result.secure_url);
            }
        }

        // 5. Parse variants
        let parsedVariants = [];

        if (variants) {
            try {
                parsedVariants =
                    typeof variants === "string"
                        ? JSON.parse(variants)
                        : variants;
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid variants format"
                });
            }
        }

        // 6. Create product
        const product = await Product.create({
            name,
            description,
            price,
            stock,
            images: imageUrls,
            store: store._id,
            variants: parsedVariants
        });

        // 7. Send response
        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        console.error("Create product error:", error);

        res.status(500).json({
            message: "Cannot create Product",
            error: error.message
        });
    }
};


// =====================================================
// GET MY PRODUCTS
// =====================================================

export const getMyProducts = async (req, res) => {
    try {
        // Find logged-in vendor's store
        const store = await Store.findOne({
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Only return products belonging to that store
        const products = await Product.find({
            store: store._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            products
        });

    } catch (error) {
        console.error("Get my products error:", error);

        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });
    }
};


// =====================================================
// GET PRODUCTS OF A STORE
// =====================================================

export const getStoreProducts = async (req, res) => {
    try {
        const { storeId } = req.params;

        // Validate store ID
        if (!mongoose.Types.ObjectId.isValid(storeId)) {
            return res.status(400).json({
                message: "Invalid store ID format"
            });
        }

        // Check whether store exists
        const store = await Store.findById(storeId);

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // Get products belonging to this store
        const products = await Product.find({
            store: storeId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            products
        });

    } catch (error) {
        console.error("Get store products error:", error);

        res.status(500).json({
            message: "Failed to get store products",
            error: error.message
        });
    }
};


// =====================================================
// UPDATE PRODUCT
// =====================================================

export const updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        const {
            name,
            description,
            price,
            stock,
            images,
            variants
        } = req.body;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID format"
            });
        }

        // 2. Find logged-in vendor's store
        const store = await Store.findOne({
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // 3. Find product belonging to this vendor's store
        const product = await Product.findOne({
            _id: productId,
            store: store._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 4. Update basic fields
        product.name = name ?? product.name;
        product.description = description ?? product.description;
        product.price = price ?? product.price;
        product.stock = stock ?? product.stock;

        // 5. Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImageUrls = [];

            for (const file of req.files) {
                const result = await uploadToCloudinary(
                    file.buffer,
                    `products/${store._id}`
                );

                newImageUrls.push(result.secure_url);
            }

            // Replace existing images with newly uploaded images
            product.images = newImageUrls;
        }
        // If no new files were uploaded, keep existing images
        else if (images !== undefined) {
            try {
                product.images =
                    typeof images === "string"
                        ? JSON.parse(images)
                        : images;
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid images format"
                });
            }
        }

        // 6. Handle variants
        if (variants !== undefined) {
            try {
                product.variants =
                    typeof variants === "string"
                        ? JSON.parse(variants)
                        : variants;
            } catch (error) {
                return res.status(400).json({
                    message: "Invalid variants format"
                });
            }
        }

        // 7. Save changes
        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error("Update product error:", error);

        res.status(500).json({
            message: "Failed to update the product",
            error: error.message
        });
    }
};


// =====================================================
// DELETE PRODUCT
// =====================================================

export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        // 1. Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID format"
            });
        }

        // 2. Find logged-in vendor's store
        const store = await Store.findOne({
            owner: req.user._id
        });

        if (!store) {
            return res.status(404).json({
                message: "Store not found"
            });
        }

        // 3. Find product belonging to this store
        const product = await Product.findOne({
            _id: productId,
            store: store._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // 4. Delete product
        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.error("Delete product error:", error);

        res.status(500).json({
            message: "Failed to delete the product",
            error: error.message
        });
    }
};


// =====================================================
// GET PRODUCT BY ID
// =====================================================

export const getProductById = async (req, res) => {
    try {
        const { productId } = req.params;

        // Validate product ID
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                message: "Invalid product ID format"
            });
        }

        // Find product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            product
        });

    } catch (error) {
        console.error("Get product error:", error);

        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });
    }
};


// import mongoose from "mongoose";

// import Store from "../models/Store.js"
// import Product from "../models/Product.js"
// import uploadToCloudinary from "../utils/uploadToCloudinary.js";

// export const createProduct = async (req, res) => {
//     try {
//         const {
//             name,
//             description,
//             price,
//             stock,
//             variants
//         } = req.body;

//         if (!name || price === undefined || stock === undefined) {
//             return res.status(400).json({
//                 message: "Name, price and stock are required."
//             });
//         }

//         const store = await Store.findOne({
//             owner: req.user._id
//         });

//         if (!store) {
//             return res.status(404).json({
//                 message: "Store not found"
//             });
//         }

//         const isProductExist = await Product.findOne({
//             name,
//             description,
//             price,
//             store: store._id
//         });

//         if (isProductExist) {
//             return res.status(400).json({
//                 message: "Product already exists"
//             });
//         }

//         // Upload images to Cloudinary
//         const imageUrls = [];

//         if (req.files && req.files.length > 0) {
//             for (const file of req.files) {
//                 const result = await uploadToCloudinary(
//                     file.buffer,
//                     `products/${store._id}`
//                 );

//                 imageUrls.push(result.secure_url);
//             }
//         }

//         // Convert variants from FormData string
//         let parsedVariants = [];

//         if (variants) {
//             try {
//                 parsedVariants =
//                     typeof variants === "string"
//                         ? JSON.parse(variants)
//                         : variants;
//             } catch (error) {
//                 return res.status(400).json({
//                     message: "Invalid variants format"
//                 });
//             }
//         }

//         const product = await Product.create({
//             name,
//             description,
//             price,
//             stock,
//             images: imageUrls,
//             store: store._id,
//             variants: parsedVariants
//         });

//         res.status(201).json({
//             message: "Product created successfully",
//             product
//         });

//     } catch (error) {
//         console.error(error);

//         res.status(500).json({
//             message: "Cannot create Product",
//             error: error.message
//         });
//     }
// };

// // export const createProduct = async (req, res) => {
// //     try{
// //         const {name, description, price, stock, images, variants} = req.body

// //         if (!name || price === undefined || stock === undefined){
// //             return res.status(400).json({
// //                 message:"Name, price and stock are required."
// //             })
// //         }

// //         const store = await Store.findOne({
// //             owner: req.user._id
// //         })

// //         if(!store){
// //             return res.status(404).json({
// //                 message:"Store not found"
// //             })
// //         }

// //         const isProductExist = await Product.findOne({
// //             name, 
// //             description,
// //             price,
// //             store: store._id
// //         })

// //         if(isProductExist){
// //             return res.status(400).json({
// //                 message:"Product already exists"
// //             })

// //         }
// //         const product = await Product.create({
// //             name,
// //             description,
// //             price,
// //             stock,
// //             images: images || [],
// //             store: store._id,
// //             variants:variants || []
// //         })
        
// //         res.status(200).json({
// //             message: "Product created successfully",
// //             product,
// //         })
// //     }
// //     catch(error){
// //         res.status(500).json({
// //             message:"Cannot create Product",
// //             error: error.message
// //         })
// //     }
// // }


// export const getMyProducts = async (req, res) => {
//   try {
//     const store = await Store.findOne({
//       owner: req.user._id,
//     });

//     if (!store) {
//       return res.status(404).json({
//         message: "Store not found",
//       });
//     }

//     const products = await Product.find({
//       store: store._id,
//     });

//     res.status(200).json({
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to get products",
//       error: error.message,
//     });
//   }
// };

// export const getStoreProducts = async (req, res) => {
//   try {
//     const { storeId } = req.params;

//     const store = await Store.findById(storeId);

//     console.log(store)

//     if (!store) {
//       return res.status(404).json({
//         message: "Store not found",
//       });
//     }

//     const products = await Product.find({
//       store: storeId,
//     });

//     res.status(200).json({
//       products,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to get store products",
//       error: error.message,
//     });
//   }
// };


// export const updateProduct = async (req, res) => {
//   try{
//     const {name, description, price, stock, images, variants} = req.body;

//     const {productId} = req.params

//     const store = await Store.findOne({owner: req.user._id})

//     if(!store){
//       return res.status(404).json({
//         message:"Store not found"
//       })
//     }

//     const product = await Product.findOne({
//       _id: productId,
//       store: store._id
//     })

//     if(!product){
//       return res.status(404).json({
//         message:"Product not found"
//       })
//     }

//     product.name = name ?? product.name;
//     product.description = description ?? product.description;
//     product.price = price ?? product.price;
//     product.stock= stock ?? product.stock;
//     product.images = images ?? product.images;
//     product.variants = variants ?? product.variants;

//     await product.save();

//     res.status(200).json({
//       message:"Product updated successfully",
//       product
//     })

//   }
//   catch(error){
//     res.status(500).json({
//       message:"Failed to update the product",
//       error: error.message
//     })
//   }
// };


// export const deleteProduct = async (req, res) => {
//   try{

//     const {productId} = req.params

//     const store = await Store.findOne({owner: req.user._id})

//     if(!store){
//       return res.status(404).json({
//         message:"Store not found"
//       })
//     }

//     const product = await Product.findOne({
//       _id: productId,
//       store: store._id
//     })

//     if(!product){
//       return res.status(404).json({
//         message:"Product not found"
//       })
//     }

//     await product.deleteOne();

//     res.status(200).json({
//       message:"Product deleted successfully"
//     })

//   }
//   catch(error){
//     res.status(500).json({
//       message:"Failed to delete the product",
//       error: error.message
//     })
//   }
// };


// export const getProductById = async (req, res) => {
//   try{
//     const {productId} = req.params;

//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       return res.status(400).json({
//         message: "Invalid product ID format",
//       });
//     }

//     const product = await Product.findById(productId);
//     console.log(product);

//     if(!product){
//       return res.status(404).json({
//         message:"Product not found"
//       })
//     }

//     res.status(200).json({
//       message:"",
//       product
//     })
//   }
//   catch(error){
//     res.status(500).json({
//       message: "Failed to get product",
//       error: error.message,
//     });
//   }
// };

