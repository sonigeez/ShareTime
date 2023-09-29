// Import necessary modules
const express = require('express');
const moment = require('moment-timezone');
const canvas = require('canvas');
const geoip = require('geoip-lite');


// Create the Express app
const app = express();

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Define the route to display the time conversion
app.get('/:region/:area', (req, res) => {
    const region = req.params.region;
    const area = req.params.area;
    const timezone = `${region}/${area}`;
    res.render('time_display', { timezone: timezone });
});

// Define the route to generate the OG image
app.get('/og-image/:region/:area', (req, res) => {
    const region = req.params.region;
    const area = req.params.area;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);
    const localTimeZone = geo['timezone'];
    console.log(localTimeZone);
    const timezone = `${region}/${area}`;
    
    const currentTime = moment.tz(localTimeZone);  // Get current time in local time zone
    const localTime = currentTime.clone().tz(timezone);  // Convert to specified time zone

    const canvasInstance = canvas.createCanvas(1200, 630);
    const ctx = canvasInstance.getContext('2d');

    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasInstance.width, canvasInstance.height);

    // Draw text
    ctx.fillStyle = '#000000';
    ctx.font = '48px sans-serif';
    ctx.fillText(`Time Conversion for ${timezone}`, 50, 315);

    ctx.font = '36px sans-serif';

    ctx.fillText(`${timezone} time: ${localTime.format('HH:mm')}`, 50, 375);
    // given timezone
    ctx.fillText(`${localTimeZone} time: ${currentTime.format('HH:mm')}`, 50, 435);
    

    res.writeHead(200, { 'Content-Type': 'image/png' });
    canvasInstance.createPNGStream().pipe(res);
});

// Define the server port
const PORT = 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
