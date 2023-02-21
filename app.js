const express = require("express");
const mongoose = require("mongoose");
const path = require('path');
const dotenv = require('dotenv');


const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if(process.env.NODE_ENV === 'production') {
  dotenv.config({path: __dirname + '/.env.production'})

  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
} else {
  dotenv.config({path: __dirname + '/.env.development'})

}

const PORT = process.env.PORT || 5000;


async function start() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    app.listen(PORT, () => console.log(`Server established at ${PORT} port`));
  } catch (error) {
    console.log("Server error: ", error.message);
    process.exit(1);
  }
}

start();
