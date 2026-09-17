import Address from "../models/Address.js";

// GET all saved addresses
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({ isDefault: -1, createdAt: -1 });

    res.status(200).json({
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      message: "Failed to fetch addresses",
    });
  }
};

// CREATE a new address
export const createAddress = async (req, res) => {
  try {
    const {label, name, phone, address, city, state, pincode, isDefault} = req.body;

    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        message: "All address fields are required",
      });
    }

    // If this is the first address, make it default address automatically
    const existingAddress = await Address.findOne({user: req.user._id});

    const shouldBeDefault = !existingAddress || isDefault === true;

    // If making this address default, remove default from other addresses
    if (shouldBeDefault) {
      await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
    }

    const newAddress = await Address.create({
      user: req.user._id,
      label: label || "HOME",
      name,
      phone,
      address,
      city,
      state,
      pincode,
      isDefault: shouldBeDefault,
    });

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Create address error:", error);

    res.status(500).json({
      message: "Failed to add address",
    });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {label, name, phone, address, city, state, pincode, isDefault} = req.body;

    const existingAddress = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!existingAddress) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    if (isDefault === true) {
      await Address.updateMany({ user: req.user._id }, { $set: { isDefault: false } });
    }

    if (existingAddress.isDefault && isDefault === false) {
      return res.status(400).json({
        message: "At least one address must remain default. Set another address as default first.",
      });
    }

    existingAddress.label = label || existingAddress.label;
    existingAddress.name = name || existingAddress.name;
    existingAddress.phone = phone || existingAddress.phone;
    existingAddress.address = address || existingAddress.address;
    existingAddress.city = city || existingAddress.city;
    existingAddress.state = state || existingAddress.state;
    existingAddress.pincode = pincode || existingAddress.pincode;

    if (typeof isDefault === "boolean") {
      existingAddress.isDefault = isDefault;
    }

    await existingAddress.save();

    res.status(200).json({
      message: "Address updated successfully",
      address: existingAddress,
    });
  } catch (error) {
    console.error("Update address error:", error);

    res.status(500).json({
      message: "Failed to update address",
    });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    const wasDefault = address.isDefault;

    await Address.deleteOne({
      _id: id,
      user: req.user._id,
    });

    // If default address was deleted, make another address default
    if (wasDefault) {
      const nextAddress = await Address.findOne({
        user: req.user._id,
      }).sort({ createdAt: -1 });

      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      message: "Failed to delete address",
    });
  }
};

// SET an address as default
export const setDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await Address.findOne({_id: id, user: req.user._id});

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }

    await Address.updateMany(
      { user: req.user._id },
      { $set: { isDefault: false } }
    );

    address.isDefault = true;
    await address.save();

    res.status(200).json({
      message: "Default address updated",
      address,
    });
  } catch (error) {
    console.error("Set default address error:", error);

    res.status(500).json({
      message: "Failed to set default address",
    });
  }
};