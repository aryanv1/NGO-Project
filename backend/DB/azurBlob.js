const blob = require("@azure/storage-blob");
require('dotenv').config();

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// console.log(AZURE_STORAGE_CONNECTION_STRING);

if (!AZURE_STORAGE_CONNECTION_STRING) {
  throw Error('Azure Storage Connection string not found');
}

// Create the BlobServiceClient object with connection string
const blobServiceClient = blob.BlobServiceClient.fromConnectionString(
  AZURE_STORAGE_CONNECTION_STRING
);

if(blobServiceClient){
    console.log("Azure Blob Connected");
}

module.exports = blobServiceClient;