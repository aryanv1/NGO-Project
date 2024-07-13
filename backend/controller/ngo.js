const { NGO, Unverified_NGOs } = require("../models/ngo");
const docsUpload = require("../blob/docsUpload");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const sendRegistrationMail = require('../SMTP/registration_ngo');
const registerNGO = async (req, res) => {
  try {
    const {
      organization_name,
      registration_number,
      tax_id_ein,
      website_url,
      password,
    } = req.body;

    const physical_addresses = JSON.parse(req.body.physical_addresses);
    const primary_contact = JSON.parse(req.body.primary_contact);

    const file1 = req.files.registration_certificate;
    const url1 = await docsUpload(file1.tempFilePath, "docs", "");
    const file2 = req.files.tax_exemption_certificate;
    const url2 = await docsUpload(file2.tempFilePath, "docs", "");

    const file3 = req.files.recent_annual_report;
    let url3 = "";
    if (file3) {
      url3 = await docsUpload(file3.tempFilePath, "docs", "");
    }

    const ngoPhotosUrls = [];

    const NGO_photos = Array.isArray(req.files.photos) 
    ? req.files.photos 
    : [req.files.photos];

    for (const photo of NGO_photos) {
        const fileName = photo.mimetype;
        const photoUrl = await docsUpload(
          photo.tempFilePath,
          "photo",
          fileName
        );
        ngoPhotosUrls.push(photoUrl);
    }

    const newNGO = new Unverified_NGOs({
      organization_name,
      registration_number,
      tax_id_ein,
      website_url,
      physical_addresses: physical_addresses,
      primary_contact: primary_contact,
      password,
      registration_certificate: url1,
      tax_exemption_certificate: url2,
      recent_annual_report: url3,
      ngo_photos: ngoPhotosUrls,
    });

    if (Object.prototype.hasOwnProperty.call(req.body, "secondary_contact")) {
      const secondary_contact = JSON.parse(req.body.secondary_contact);
      console.log(secondary_contact);
      newNGO.secondary_contact = secondary_contact;
    }

    const temp = await NGO.findOne({
      $or: [
        { "primary_contact.email": newNGO.primary_contact.email },
        { "primary_contact.phone": newNGO.primary_contact.phoneno },
      ],
    });

    if (temp) {
      return res.status(400).json({
        message: "Duplicate entry detected for email or phone number",
      });
    }

    await newNGO.save();
    sendRegistrationMail(newNGO);
    res.status(201).json({
      message: "NGO registered successfully",
      ngo: newNGO,
    });
  } catch (error) {
    console.log(error);
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(500).json({
        message: "Error registering NGO",
        error: error.message,
      });
    }
  }
};

const loginNGO = async (req, res) => {
  try {
    const { email, password } = req.body;

    const ngo = await NGO.findOne({ "primary_contact.email": email });
    if (!ngo) {
      return res.status(400).json({ message: "Invalid email." });
    }

    const isMatch = await ngo.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: ngo._id }, process.env.JWT_SECRET_NGO, {
      expiresIn: "5d",
    });

    res.status(200).json({
      message: "NGO Login successful",
      token,
    });
  } catch (error) {
    console.error("Error during NGO login");
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllngos = async (req, res) => {
  try {
    const ngos = await NGO.find();
    res.status(200).json({ ngos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getNGOById = async (req, res) => {
  
  const ngoId = req.user.id;
  // Check if the ID is a valid ObjectId
  if (!mongoose.isValidObjectId(ngoId)) {
    console.log("Invalid NGO ID.");
    return res.status(400).json({ message: "Invalid NGO ID format" });
  }

  try {
    const ngo = await NGO.findOne({ _id: ngoId });
    if (!ngo) {
      return res
        .status(404)
        .json({ message: `No NGO found with ID : ${ngoId}` });
    }

    res.status(200).json(ngo);
  } catch (error) {
    console.error("Error fetching NGO:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching the NGO" });
  }
};

const updateNGODetails = async (req, res) => {
  
  const ngoId = req.user.id;

  if (!mongoose.isValidObjectId(ngoId)) {
    console.log("Invalid NGO ID format.");
    return res.status(400).json({ message: "Invalid NGO ID format" });
  }

  try {
    const { organization_name, website_url } = req.body;

    const parsed_physical_address = JSON.parse(req.body.physical_addresses);
    const parsed_primary_contact = JSON.parse(req.body.primary_contact);

    const newNGO = {
      organization_name,
      website_url,
      physical_addresses: parsed_physical_address,
      primary_contact: parsed_primary_contact,
    };
    

    if (Object.prototype.hasOwnProperty.call(req.body, "secondary_contact")) {
      const secondary_contact = JSON.parse(req.body.secondary_contact);
      newNGO.secondary_contact = secondary_contact;
    }

    // const duplicateContact = await NGO.findOne({
    //   $or: [
    //     { "primary_contact.email": parsed_primary_contact.email },
    //     { "primary_contact.phoneno": parsed_primary_contact.phoneno },
    //     { "secondary_contact.email": parsed_primary_contact.email },
    //     { "secondary_contact.phoneno": parsed_primary_contact.phoneno },
    //     { "primary_contact.email": req.body.secondary_contact?.email },
    //     { "primary_contact.phoneno": req.body.secondary_contact?.phoneno },
    //     { "secondary_contact.email": req.body.secondary_contact?.email },
    //     { "secondary_contact.phoneno": req.body.secondary_contact?.phoneno }
    //   ],
    //   _id: { $ne: ngoId } // Exclude the current NGO being updated
    // });

    // if (duplicateContact) {
    //   return res.status(400).json({ message: "Duplicate email or phone number detected." });
    // }

    // const ngoPhotosUrls = [];

    // const NGO_photos = Array.isArray(req.files.photos) 
    // ? req.files.photos 
    // : [req.files.photos];

    // for (const photo of NGO_photos) {
    //     const fileName = photo.mimetype;
    //     const photoUrl = await docsUpload(
    //       photo.tempFilePath,
    //       "photo",
    //       fileName
    //     );
    //     ngoPhotosUrls.push(photoUrl);
    // }

    await NGO.updateOne({ _id: ngoId }, newNGO);
    res.status(200).send("success!!");
  } catch (error) {
    if (error.code == 11000) {
      const dup = Object.keys(error.keyValue)[0];
      res.status(400).json({
        message: `Duplicate entry detected for ${dup}`,
      });
    } else {
      res.status(500).json({
        message: "Error updating NGO",
        error: error.message,
      });
    }
  }
};

const deleteNGO = async (req, res) => {
  
  const ngoId = req.user.id;

  if (!mongoose.isValidObjectId(ngoId)) {
    console.log("Invalid NGO ID.");
    return res.status(400).json({ message: "Invalid NGO ID format" });
  }
  try {
    const deletedngo = await NGO.findByIdAndDelete(ngoId);

    if (!deletedngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    res.status(200).json({ message: "NGO deleted successfully" });
  } catch (error) {
    console.error("Error fetching NGO:", error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerNGO,
  getAllngos,
  getNGOById,
  updateNGODetails,
  deleteNGO,
  loginNGO,
};