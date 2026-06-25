const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.use(express.json());

const shipments = [
    {
    id: "SH001",
    customer: "ABC Logistics",
    origin: "Hyderabad",
    destination: "Dubai",
    status: "Booking Confirmed",
    history: ["Booking Confirmed"]
},
    {
    id: "SH002",
    customer: "XYZ Cargo",
    origin: "Mumbai",
    destination: "Singapore",
    status: "In Transit",
    history: ["Booking Confirmed", "In Transit"]
}
];

app.get("/", (req, res) => {
    res.send("Air Cargo Backend Running");
});

app.get("/shipments", (req, res) => {
    try {
        res.json(shipments);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/dashboard", (req, res) => {
    try {

        const total = shipments.length;

        const delivered = shipments.filter(
            s => s.status === "Delivered"
        ).length;

        const inTransit = shipments.filter(
            s => s.status === "In Transit"
        ).length;

        const bookingConfirmed = shipments.filter(
            s => s.status === "Booking Confirmed"
        ).length;

        const departed = shipments.filter(
            s => s.status === "Departed"
        ).length;

        const arrived = shipments.filter(
            s => s.status === "Arrived"
        ).length;

        const customsCleared = shipments.filter(
            s => s.status === "Customs Cleared"
        ).length;

        res.json({
            totalShipments: total,
            delivered,
            inTransit,
            bookingConfirmed,
            departed,
            arrived,
            customsCleared
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/shipments/:id", (req, res) => {
    try {

        const shipment = shipments.find(
            s => s.id === req.params.id
        );

        if (!shipment) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        res.json(shipment);

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/history/:id", (req, res) => {
    try {

        const shipment = shipments.find(
            s => s.id.toUpperCase() === req.params.id.toUpperCase()
        );

        if (!shipment) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        res.json({
            shipmentId: shipment.id,
            history: shipment.history
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.put("/shipments/:id", (req, res) => {
    try {

        const shipment = shipments.find(
            s => s.id === req.params.id
        );

        if (!shipment) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        const newStatus = req.body.status;

        shipment.status = newStatus;

        if (!shipment.history) {
            shipment.history = [];
        }

        if (!shipment.history.includes(newStatus)) {
            shipment.history.push(newStatus);
        }

        res.json({
            message: "Status Updated Successfully",
            data: shipment
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.post("/shipments", (req, res) => {
    try {

        const { id, customer, origin, destination, status } = req.body;

        const existingShipment = shipments.find(
            s => s.id.toUpperCase() === id.toUpperCase()
        );

        if (existingShipment) {
            return res.status(400).json({
                message: "Shipment ID already exists"
            });
        }

        if (!id || !customer || !origin || !destination || !status) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const newShipment = {
            ...req.body,
            id: id.toUpperCase(),
            history: [status]
        };

        shipments.push(newShipment);

        res.json({
            message: "Shipment Created Successfully",
            data: newShipment
        });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});


app.listen(3000, () => {
    console.log("Server Started");
});