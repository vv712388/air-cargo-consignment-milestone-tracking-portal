const express = require("express");

const app = express();

app.use(express.json());

const shipments = [
    {
        id: "SH001",
        customer: "ABC Logistics",
        origin: "Hyderabad",
        destination: "Dubai",
        status: "Booking Confirmed"
    },
    {
        id: "SH002",
        customer: "XYZ Cargo",
        origin: "Mumbai",
        destination: "Singapore",
        status: "In Transit"
    }
];

app.get("/", (req, res) => {
    res.send("Air Cargo Backend Running");
});

app.get("/shipments", (req, res) => {
    res.json(shipments);
});

app.post("/shipments", (req, res) => {
    res.json({
        message: "Shipment Created Successfully"
    });
});

app.listen(3000, () => {
    console.log("Server Started");
});