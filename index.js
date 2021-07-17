const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// Set Up Server

const app = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log (`Server Started on port : ${PORT}`));
app.use(express.json())

mongoose.connect(process.env.MDB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true
    },
    (err) => 
    {
        if (err) return console.error(err);
        console.log("Connected To MongoDB");
    }
);

app.use("/webhook", require("./routers/Webhookrouter"));














// use : npm run dev
//          OR 
//       npm run start

