const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose
    .connect(url, {
      // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useFindAndModify:false
    // useCreateIndex
    }).then(()=>{
      console.log("Mongo Connected");
    }
    ).catch((e)=>{
      console.log(e);
    })
}

module.exports = connectDB;