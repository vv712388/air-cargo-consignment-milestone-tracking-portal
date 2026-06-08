const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Air Cargo Backend Running");
});

app.post("/shipments", (req, res) => {
    res.json({
        message: "Shipment Created Successfully"
    });
});

app.listen(3000, () => {
    console.log("Server Started");
}); 