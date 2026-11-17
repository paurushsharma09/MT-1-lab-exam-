
import express from 'express';

const app = express();

app.use(express.json());

// Sample vehicle records
let vehicles = [
    {
        id: 1,
        vehicleName: "Hyundai Creta",
        vehicleNumber: "HR26AB1234",
        type: "SUV",
        price: 1500000
    },
    {
        id: 2,
        vehicleName: "Honda City",
        vehicleNumber: "DL8CAB1234",
        type: "Sedan",
        price: 1200000
    },
    {
        id: 3,
        vehicleName: "Maruti Swift",
        vehicleNumber: "UP16AB1234",
        type: "Hatchback",
        price: 750000
    }
];

const validVehicle = (v) => {
    return v &&
        Number.isInteger(v.id) &&
        v.vehicleName &&
        v.vehicleNumber &&
        v.type &&
        typeof v.price === 'number' &&
        Number.isFinite(v.price) &&
        v.price > 0;
};

// 1. GET all vehicles
app.get('/vehicles', (req, res) => {
    res.status(200).json(vehicles);
});

// 2. GET vehicle by ID
app.get('/vehicles/:id', (req, res) => {

    const vehicle = vehicles.find(
        v => v.id === Number(req.params.id)
    );

    if (!vehicle) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    res.json(vehicle);
});

// 3. POST - Add vehicle
app.post('/vehicles', (req, res) => {

    const vehicle = req.body;

    if (!validVehicle(vehicle)) {
        return res.status(400).json({
            message: 'Invalid or missing vehicle details'
        });
    }

    if (vehicles.some(v => v.id === vehicle.id)) {
        return res.status(400).json({
            message: 'Vehicle ID already exists'
        });
    }

    vehicles.push(vehicle);

    res.status(201).json({
        message: 'Vehicle added successfully',
        vehicle: vehicle
    });
});

// 4. PUT - Update vehicle
app.put('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(
        v => v.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const updatedVehicle = {
        ...vehicles[index],
        ...req.body,
        id: id
    };

    if (!validVehicle(updatedVehicle)) {
        return res.status(400).json({
            message: 'Invalid vehicle details'
        });
    }

    vehicles[index] = updatedVehicle;

    res.json({
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle
    });
});

// 5. DELETE - Remove vehicle
app.delete('/vehicles/:id', (req, res) => {

    const id = Number(req.params.id);

    const index = vehicles.findIndex(
        v => v.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            message: 'Vehicle not found'
        });
    }

    const deletedVehicle = vehicles.splice(index, 1);

    res.json({
        message: 'Vehicle deleted successfully',
        vehicle: deletedVehicle[0]
    });
});

// Handle invalid routes
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Start server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
