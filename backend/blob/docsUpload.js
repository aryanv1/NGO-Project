const blobServiceClient = require("../DB/azurBlob");
const path = require("path");

const docsUpload = async (filePath, type, mime="") => {
  try {
    let blobName = "";
    let blobOptions;
    if (type == "photo") {
      blobName = process.env.PHOTO_BLOB;
      blobOptions = {blobHTTPHeaders: { blobContentType: mime}};
    } else if (type == "docs") {
      blobName = process.env.DOCS_BLOB;
      blobOptions = { blobHTTPHeaders: { blobContentType: "application/pdf" } };
    } else {
      return res
        .status(404)
        .json({ message: "Invalid type specified for document upload." });
    }

    // console.log(blobOptions);

    const containerClient = blobServiceClient.getContainerClient(blobName);
    await containerClient.createIfNotExists();

    const blockBlobClient = containerClient.getBlockBlobClient(
      path.basename(filePath)
    );
    const url = blockBlobClient.url;

    const uploadBlobResponse = await blockBlobClient.uploadFile(
      filePath,
      blobOptions
    );

    return url;
  } catch (error) {
    console.log("This is error from ./blob/azureBlob.js : ");
    console.log(error);
    return res.status(500).json({ message: "Failed to upload document" });
  }
};

module.exports = docsUpload;
