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

    const { id, customer, origin, destination, status } = req.body;

    if (!id || !customer || !origin || !destination || !status) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const newShipment = req.body;

    shipments.push(newShipment);

    res.json({
        message: "Shipment Created Successfully",
        data: newShipment
    });
});

app.listen(3000, () => {
    console.log("Server Started");
});