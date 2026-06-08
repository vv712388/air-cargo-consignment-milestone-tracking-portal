
const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("Air Cargo Backend Running");
});

app.listen(3000, () => {
    console.log("Server Started");
});

console.log("Backend Started");

