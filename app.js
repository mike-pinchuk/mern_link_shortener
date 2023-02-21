const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const path = require('path');

const PORT = config.get("port") || 5000;

const app = express();

app.use(express.json({ extended: true }));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if(process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.get("mongoUri"), {
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
