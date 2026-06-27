console.log("SERVER FILE LOADED");
const express = require("express");
const cors = require("cors");
const db = require("./db");
const app = express();
app.use(cors());

app.use(express.json());

// const shipments = [
//     {
//     id: "SH001",
//     customer: "ABC Logistics",
//     origin: "Hyderabad",
//     destination: "Dubai",
//     status: "Booking Confirmed",
//     history: ["Booking Confirmed"]
// },
//     {
//     id: "SH002",
//     customer: "XYZ Cargo",
//     origin: "Mumbai",
//     destination: "Singapore",
//     status: "In Transit",
//     history: ["Booking Confirmed", "In Transit"]
// }
// ];
const validFlow = {
    "Booking Confirmed": "Documentation Complete",
    "Documentation Complete": "Cargo Accepted",
    "Cargo Accepted": "Departed",
    "Departed": "In Transit",
    "In Transit": "Arrived",
    "Arrived": "Customs Cleared",
    "Customs Cleared": "Delivered"
};

app.get("/", (req, res) => {
    res.send("Air Cargo Backend Running");
});

app.get("/shipments", (req, res) => {

    const sql = "SELECT * FROM shipments";

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result);

    });

});
app.get("/dashboard", (req, res) => {

    const sql = `
        SELECT
            COUNT(*) AS totalShipments,

            SUM(CASE WHEN status='Delivered'
                THEN 1 ELSE 0 END) AS delivered,

            SUM(CASE WHEN status='In Transit'
                THEN 1 ELSE 0 END) AS inTransit,

            SUM(CASE WHEN status='Booking Confirmed'
                THEN 1 ELSE 0 END) AS bookingConfirmed,

            SUM(CASE WHEN status='Departed'
                THEN 1 ELSE 0 END) AS departed,

            SUM(CASE WHEN status='Arrived'
                THEN 1 ELSE 0 END) AS arrived,

            SUM(CASE WHEN status='Customs Cleared'
                THEN 1 ELSE 0 END) AS customsCleared,

            SUM(CASE WHEN delay = 1
    THEN 1 ELSE 0 END) AS delayedCount
        FROM shipments
    `;

    db.query(sql, (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        res.json(result[0]);

    });

});

    
    
app.get("/shipments/:id", (req, res) => {
    try {

      const shipmentId = req.params.id;  
      
      const sql = `
      SELECT *
      FROM shipments
      WHERE id = ?
     `;
      
     db.query(
    sql,
    [shipmentId],
    (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        res.json(result[0]);
    }
);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error"
        });
    }
});
app.get("/history/:id", (req, res) => {

    const shipmentId = req.params.id;

    const sql = `
        SELECT id, status
        FROM shipments
        WHERE id = ?
    `;

    db.query(sql, [shipmentId], (err, result) => {

        if (err) {
            console.log(err);

            return res.status(500).json({
                message: "Database Error"
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "Shipment not found"
            });
        }

        res.json({
            shipmentId: result[0].id,
            history: [
                {
                    status: result[0].status
                }
            ]
        });

    });

});
app.put("/shipments/:id", (req, res) => {

    const shipmentId = req.params.id;
    const newStatus = req.body.status;

    const sql = `
        UPDATE shipments
        SET status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [newStatus, shipmentId],
        (err, result) => {

            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Shipment not found"
                });
            }

            res.json({
                message: "Status Updated Successfully"
            });

        }
    );

});
app.post("/shipments", (req, res) => {
    console.log(req.body);
    try {

        const {
    id,
    customer,
    origin,
    destination,
    cargoType,
    packageCount,
    weight,
    status
} = req.body;

        

        if (!id || !customer || !origin || !destination || !status) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }


        const sql = `
INSERT INTO shipments
(id, customer, origin, destination, cargoType,
packageCount, weight, status, owner, delay)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

db.query(
    sql,
    [
        id.toUpperCase(),
        customer,
        origin,
        destination,
        cargoType,
        packageCount,
        weight,
        status,
        "Operations Staff",
        0
    ],
    (err, result) => {

        if (err) {
               console.log(err);
               return res.status(500).json({
                message: "Database Error",
                error: err.message
         });
       }

        res.json({
            message: "Shipment Created Successfully"
        });

    }
);

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