
import http from 'http';
import fs from 'fs';

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

const server = http.createServer((req, res) => {

    // Welcome route
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>Welcome to Vehicle Management System</h1>');
    }

    // Get all vehicles
    else if (req.method === 'GET' && req.url === '/vehicles') {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(vehicles));
    }

    // About route
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end('<h2>Vehicle Management Application using Node.js</h2>');
    }

    // Serve static HTML file
    else if (req.method === 'GET' && req.url === '/info') {
        fs.readFile('./public/info.html', 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });

                res.end('Internal Server Error');
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.end(data);
            }
        });
    }

    // Add a new vehicle
    else if (req.method === 'POST' && req.url === '/add-vehicle') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            try {
                const vehicle = JSON.parse(body);

                const requiredFields = [
                    'id',
                    'vehicleName',
                    'vehicleNumber',
                    'type',
                    'price'
                ];

                const valid = requiredFields.every(field =>
                    vehicle[field] !== undefined &&
                    vehicle[field] !== null &&
                    vehicle[field] !== ''
                );

                if (!valid || typeof vehicle.price !== 'number' ||
                    vehicle.price <= 0 || !Number.isInteger(vehicle.id)) {

                    res.writeHead(400, {
                        'Content-Type': 'application/json'
                    });

                    res.end(JSON.stringify({
                        message: 'Invalid vehicle details'
                    }));

                    return;
                }

                vehicles.push(vehicle);

                res.writeHead(201, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Vehicle added successfully',
                    vehicle: vehicle
                }));

            } catch (error) {

                res.writeHead(400, {
                    'Content-Type': 'application/json'
                });

                res.end(JSON.stringify({
                    message: 'Invalid JSON'
                }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });

        res.end('404 Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
