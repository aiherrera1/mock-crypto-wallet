const express = require("express");
const app = express();
const PORT = 3000;

app.get("/crypto-exchange", (req, res) => {
  const isFailure = Math.random() < 0.1;
  if (isFailure) {
    return res.status(500).send("Internal Server Error");
  }

  res.status(200).send("Success");
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
