// server.js
require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mysql = require('mysql2/promise'); // Use promise-based version
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');    // <--- NEW: For resolving file paths
const fs = require('fs');
const puppeteer = require('puppeteer'); //Import puppeteer
const fetch = require('node-fetch');
const cors = require('cors'); // Import cors


// --- Import your pricing config and calculator ---
const PRICING_CONFIG = require('./pricingConfig');
const calculateBackendPrice = require('./priceCalculator'); // This is your calculation function


const app = express();
const port = process.env.PORT || 5000; // Use port from .env or default to 5000

// Middleware
app.use(express.json()); // For parsing application/json
app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: '*' // IMPORTANT: Adjust this to your frontend's actual URL.
}));

// Database Connection Pool (Recommended for production)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Verify DB connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to MySQL database!');
        connection.release(); // Release the connection back to the pool
    })
    .catch(err => {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit process if DB connection fails
    });

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true', // Converts string to boolean
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify Nodemailer connection (optional, but good for debugging)
transporter.verify((error, success) => {
    if (error) {
        console.error('Nodemailer configuration error:', error);
    } else {
        console.log('Nodemailer ready to send emails');
    }
})

// --- Utility function to format selections for email (Crucial for clear emails!) ---
function formatSelectionsForEmail(selections) {
    let formattedHtml = '<h3>Selected Services:</h3><ul>';
    let formattedText = 'Selected Services:\n';

    // A list of values that indicate 'no selection' for a given category
    const noSelectionIndicators = new Set([
        'No', 'No Static Graphics', 'No Animated GIFs', 'No Social Videos',
        'No Caption Writing', 'No Ad Banners', 'No Infographic', 'No Custom Icons',
        'No Presentation Template', 'No Explainer Video', 'No Motion Graphics',
        'No Interactive Element', 'No Consultation', 'No Logo Design',
        'No Social Media Pack', 'No Digital Template', 'No Brochure/Flyer',
        'No Collateral Suite', 'No Priority Consulting'
    ]);

    for (const categoryKey in selections) {
        if (selections.hasOwnProperty(categoryKey)) {
            const value = selections[categoryKey];

            // Clean up category key for display (e.g., 'websiteType' -> 'Website Type')
            const displayCategoryKey = categoryKey.replace(/([A-Z])/g, ' $1')
                                                   .replace(/^./, str => str.toUpperCase());


            if (typeof value === 'boolean') {
                if (value === true) {
                    formattedHtml += `<li><strong>${displayCategoryKey}:</strong> Yes</li>`;
                    formattedText += `${displayCategoryKey}: Yes\n`;
                }
                // Don't list 'No' boolean options
            } else if (typeof value === 'string' && value.trim() !== '' && !noSelectionIndicators.has(value.trim())) {
                formattedHtml += `<li><strong>${displayCategoryKey}:</strong> ${value}</li>`;
                formattedText += `${displayCategoryKey}: ${value}\n`;
            }
            // If value is a number (e.g., direct price input, though not expected here) or other types,
            // you might add more specific handling.
        }
    }
    formattedHtml += '</ul>';
    return { html: formattedHtml, text: formattedText };
}

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Touch Domain Backend is running!');
});


app.post('/api/submit-quote', async (req, res) => {
    const { clientName, clientEmail, phoneNumber, selectedServices, frontendCalculatedPrice, message } = req.body;

    // --- Server-side Validation ---
    if (!clientName || !clientEmail || !selectedServices || frontendCalculatedPrice === undefined) {
        return res.status(400).json({ message: 'Missing required quote data.' });
    }
    if (!clientEmail || clientEmail.trim() === '' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
        return res.status(400).json({ message: 'A valid Client Email is required.' });
    }
    // Phone number is optional in the frontend, but if sent, validate length
    if (phoneNumber && phoneNumber.trim().length < 7) {
        return res.status(400).json({ message: 'Phone Number must be at least 7 digits if provided.' });
    }

   // Check if any services were actually selected (optional, based on your form logic)
    const hasAnyServiceSelected = Object.values(selectedServices).some(value => {
        if (typeof value === 'boolean') return value; // True for selected checkboxes
        if (typeof value === 'string') return value !== '' && !value.startsWith('No '); // Non-empty string, not a "No X" option
        return false;
    });

    if (!hasAnyServiceSelected) {
        return res.status(400).json({ message: 'Please select at least one service to request a quote.' });
    }

    try {
        // --- Backend Price Calculation and Validation ---
        // calculateBackendPrice returns an object: { price: Number, consultationRequired: Boolean }
        const { price: backendCalculatedPrice, consultationRequired } = calculateBackendPrice(selectedServices);

        // Optional: Compare frontend and backend prices for discrepancy detection
        // If frontend price is provided and differs significantly, log it.
        // For security, always trust the backendCalculatedPrice for database storage and final quote.
        if (frontendCalculatedPrice !== undefined && Math.abs(parseFloat(frontendCalculatedPrice) - backendCalculatedPrice) > 0.01) {
            console.warn(`Price mismatch detected for ${clientEmail}: Frontend R${frontendCalculatedPrice} vs Backend R${backendCalculatedPrice}`);
            // You might choose to send an internal alert here if this is a major concern.
        }

        // Determine price display for emails
        const priceDisplay = `R ${backendCalculatedPrice.toFixed(2)}`;

        // --- Prepare Email Content ---
        const { html: servicesHtml, text: servicesText } = formatSelectionsForEmail(selectedServices);

        // 1. Store in Database
        // Use backendCalculatedPrice.toFixed(2) for consistent storage, or backendCalculatedPrice directly.
        // The `message` field can be empty, so handle it for DB.
        const [result] = await pool.execute(
            'INSERT INTO quotes (client_name, client_email, phone_number, selected_services, calculated_price, message, submission_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [clientName, clientEmail, phoneNumber || null, JSON.stringify(selectedServices), backendCalculatedPrice, message || null]
        );
        console.log('Quote saved to database with ID:', result.insertId);

        //-- Generate PDF with Puppeteer ---
        const currentDate = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg', dateStyle: 'long', timeStyle: 'short' });
        const quoteNumber = `TDQ-${result.insertId.toString().padStart(5, '0')}`;
            //Bank details:
        const bankName = process.env.BANK_NAME || 'Your Bank Name';
        const accountNumber = process.env.ACCOUNT_NUMBER || '1234567890';
        const branchCode = process.env.BRANCH_CODE || '012345';
        const accountHolder = process.env.ACCOUNT_HOLDER || 'Touch Domain (Pty) Ltd';

            // Construct HTML for the PDF
        const pdfHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Quotation - Touch Domain</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
                    .pdf-header-container {
                        display: flex;
                        justify-content: space-between; /* Pushes left and right content apart */
                        align-items: flex-start; /* Aligns content to the top of the container */
                        margin-bottom: 30px;
                        margin-top: -20px;
                    }

                    .header-left-content {
                        display: flex; /* To put logo and text details side-by-side */
                        align-items: flex-start; /* Align logo and text details to the top */
                        flex-direction: column; /* Stack logo/details block above quote meta */
                    }

                    .company-branding {
                        display: flex;
                        align-items: center; /* Vertically center logo and company details */
                        margin-bottom: 10px; /* Space between company info and quote meta */
                    }

                    .header-logo {
                        max-width: 130px; /* Adjust size as needed */
                        height: auto;
                        margin-right: 15px; /* Space between logo and text */
                    }

                    .company-details p {
                        margin: 0; /* Remove default paragraph margins */
                        line-height: 1.2; /* Adjust line height for stacked info */
                        font-size: 13px; /* Adjust font size */
                        margin-right: 15px;
                    }

                    .quote-meta p {
                        margin: 0; /* Remove default paragraph margins */
                        line-height: 1.2;
                        font-size: 13px;
                    }

                    .header-right-content h1 {
                        color: #452c63; /* Maintain your brand color for the heading */
                        margin: 0; /* Remove default h1 margins */
                        font-size: 24px; /* Adjust heading size */
                    }
                    .section { margin-bottom: 18px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
                    .section h2 { color: #452c63; border-bottom: 2px solid #9972ab; padding-bottom: 5px; margin-bottom: 15px; }
                    ul { list-style: none; padding: 0; }
                    li { margin-bottom: 5px; }
                    strong { color: #555; }
                    .price-section { text-align: left; margin-top: 30px; }
                    .price-section h2 { font-size: 24px; color: #452c63; }
                    .consultation-note { color: red; font-weight: bold; margin-top: 10px; }
                    .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #777; }
                    .banking-details { margin-top: 30px; border: 1px solid #ddd; padding: 15px; background-color: #f9f9f9; text-align: left; }
                    .banking-details p { margin: 5px 0; }
                    .disclaimer { /* NEW CSS for disclaimer */
                        margin-top: 30px;
                        padding: 15px;
                        border: 1px solid #ffc107; /* Light orange border */
                        background-color: #fff3cd; /* Light orange background */
                        color: #664d03; /* Darker orange text */
                        font-size: 14px;
                        text-align: justify;
                    }
                    .disclaimer strong {
                        color: #664d03; /* Ensure bold text maintains color */
                    }
                    .footer { 
                        margin-top: 50px; 
                        text-align: center; 
                        font-size: 12px; 
                        color: #777;
                        display: flex;
                        justify-content: center; /* Centers the items horizontally */
                        align-items: center;     /* Vertically aligns items if they have different heights */
                        flex-wrap: wrap;         /* Allows items to wrap to the next line if the content is too wide for the page */
                        gap: 10px;               /* Adds space between each item (e.g., 10px) */
                        padding: 0 10px; 
                    }
                    .footer p {
                        margin: 0; /* Important: Remove default paragraph margins to prevent new lines */
                        white-space: nowrap; /* Optional: Prevents text within an individual p tag from wrapping */
                    }
                </style>
            </head>
            <body>
                <div class="pdf-header-container">
                    <div class="header-left-content">
                        <div class="company-branding">
                            <img src="${process.env.APP_LOGO_URL || 'https://via.placeholder.com/150x50?text=Touch+Domain+Logo'}" alt="Touch Domain Logo" class="header-logo">
                            <div class="company-details">
                                <p><strong>Touch Domain (Pty) Ltd</strong></p>
                                <p>Tel: ${process.env.COMPANY_PHONE || '+27 12 345 6789'}</p>
                                <p>Email: ${process.env.EMAIL_USER.replace(/"[^"]*"\s*<|>/g, '')}</p>
                            </div>
                        </div>
                        <div class="quote-meta">
                            <p><strong>Quote No:</strong> ${quoteNumber}</p>
                            <p><strong>Date:</strong> ${currentDate}</p>
                        </div>
                    </div>
                    <div class="header-right-content">
                        <h1>EST QUOTATION</h1>
                    </div>
                </div>

                <div class="section services">
                    <h2>Selected Services</h2>
                    ${servicesHtml}
                </div>

                <div class="price-section">
                    <h2>Estimated Price: ${priceDisplay}</h2>
                    ${consultationRequired ? '<p class="consultation-note">* Please note: Some of your selections require a personalized consultation. Our team will contact you shortly to discuss further and provide an accurate quote.</p>' : ''}
                </div>

                <div class="disclaimer">
                    <p><strong>Disclaimer:</strong> This quotation is an **estimation** based on your initial selections and current market rates. The final price may vary based on your specific requirements, custom features, and any additional services discussed during our upcoming consultation. Our team will contact you shortly to schedule a session to finalize your needs, and a comprehensive, **official quotation will be formulated thereafter**.</p>
                </div>

                <div class="banking-details">
                    <h2>Banking Details</h2>
                    <p><strong>Bank Name:</strong> ${bankName}</p>
                    <p><strong>Account Holder:</strong> ${accountHolder}</p>
                    <p><strong>Account Number:</strong> ${accountNumber}</p>
                    <p><strong>Branch Code:</strong> ${branchCode}</p>
                </div>

                <div class="footer">
                    <p>Touch Domain (Pty) Ltd</p>
                    <p>Website: ${process.env.APP_WEBSITE_URL || 'www.touchdomain.co.za'}</p>
                    <p>&copy; ${new Date().getFullYear()} Touch Domain. All rights reserved.</p>
                </div>
            </body>
            </html>
        `;

        let pdfBuffer;
        let browser; // Declarre browser variable outside try-block for finally-block access
        try {
            browser = await puppeteer.launch({
                headless: true, // Run in headless mode (no visible browser UI)
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recommended for production environments (e.g., Docker, Linux)
            });
            const page = await browser.newPage();
                //Set the content of the page to your HTML string
            await page.setContent(pdfHtmlContent, { waitUntil: 'networkidle0' }); // Wait for network to be idle (all resources loaded)

                // Generate the PDF
            pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true, // Ensures backgrounds (like colors in banking-details) are printed
                margin: {
                    top: '8mm',
                    right: '15mm',
                    bottom: '15mm',
                    left: '15mm'
                }
            });
            console.log('PDF generated successfully with Puppeteer.');
        } catch (pdfError) {
            console.error('Error generating PDF with Puppeteer:', pdfError);
            // Decide if you want to abort the email sending or continue without attachment
            // For now, we'll continue, but the attachment will be missing.
        } finally {
            if (browser) {
                await browser.close(); // Ensure the browser instance is closed
            }
        }
        // 2. Send Email Notification to Admin
        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, // Send to admin or fallback to EMAIL_USER
            subject: `New Quote Request from ${clientName} - Touch Domain`,
            html: `
                <h1>New Quote Request Received!</h1>
                <p><strong>Client Name:</strong> ${clientName}</p>
                <p><strong>Client Email:</strong> ${clientEmail}</p>
                <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
                <p><strong>Calculated Price:</strong> ${priceDisplay}</p>
                ${consultationRequired ? '<p style="color: red; font-weight: bold;">(CONSULTATION REQUIRED)</p>' : ''}
                <p><strong>Selected Services:</strong></p>
                ${servicesHtml}
                <p><strong>Client Message:</strong> ${message || 'No message provided.'}</p>
                <br>
                <p>Please contact the client to follow up on this request.</p>
            `,
            text: `New Quote Request Received!\n\nClient Name: ${clientName}\nClient Email: ${clientEmail}\nPhone Number: ${phoneNumber || 'N/A'}\nCalculated Price: ${priceDisplay}\n${consultationRequired ? '(CONSULTATION REQUIRED)' : ''}\nSelected Services:\n${servicesText}\nClient Message: ${message || 'No message provided.'}\n\nPlease contact the client to follow up on this request.`
        };

        // 3. Send Confirmation Email to Client
        const mailOptionsClient = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: `Your Touch Domain Quote Request Confirmation`,
            html: `
                <h1>Thank you for your quote request, ${clientName}!</h1>
                <p>We've received your request for a custom quote with the following details:</p>
                <p><strong>Estimated Price:</strong> ${priceDisplay}</p>
                ${consultationRequired ? '<p style="color: red; font-weight: bold;">* Please note: Some of your selections require a personalized consultation. Our team will contact you shortly to discuss further and provide an accurate quote.</p>' : ''}
                <p><strong>Selected Services:</strong></p>
                ${servicesHtml}
                <br>
                <p>We'll review your request and get back to you shortly.</p>
                <br>
                <p>Best regards,</p>
                <p>The Touch Domain Team</p>
            `,
            text: `Thank you for your quote request, ${clientName}!\n\nWe've received your request for a custom quote with the following details:\n\nEstimated Price: ${priceDisplay}\n${consultationRequired ? '* Please note: Some of your selections require a personalized consultation. Our team will contact you shortly to discuss further and provide an accurate quote.' : ''}\n\nSelected Services:\n${servicesText}\n\nWe'll review your request and get back to you shortly.\n\nBest regards,\nThe Touch Domain Team`,
            // This is the crucial part for the attachment:
            attachments: pdfBuffer ? [
                {
                    filename: `Touch_Domain_Quotation_${quoteNumber}.pdf`, // Dynamic filename
                    content: pdfBuffer, // The PDF content as a buffer
                    contentType: 'application/pdf'
                }
            ] : [] // If pdfBuffer is null/undefined, send an empty array of attachments
        };

        await transporter.sendMail(mailOptionsAdmin);
        console.log('Admin notification email sent.');

        await transporter.sendMail(mailOptionsClient);
        console.log('Client confirmation email sent.');

        res.status(200).json({ message: 'Quote submitted successfully! Please check your email for confirmation.' });

    } catch (error) {
        console.error('Error submitting quote:', error);
        res.status(500).json({ message: 'Failed to submit quote. An internal server error occurred.' });
    }
});

// NEW: API Endpoint to book a consultation
app.post('/api/book-consultation', async (req, res) => {
    const { consultationName, consultationEmail, consultationPhone, consultationDateTime } = req.body;

    // Simple validation
    if (!consultationName || !consultationEmail || !consultationDateTime) {
        return res.status(400).json({ message: 'Name, email, and preferred date/time are required.' });
    }

    try {
        // --- Send Email Notification to Admin ---
        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Sends the notification to yourself
            subject: `NEW Consultation Request from ${consultationName}`,
            html: `
                <h2>New Consultation Request</h2>
                <p><strong>Name:</strong> ${consultationName}</p>
                <p><strong>Email:</strong> ${consultationEmail}</p>
                <p><strong>Phone:</strong> ${consultationPhone || 'N/A'}</p>
                <p><strong>Requested Date & Time:</strong> ${new Date(consultationDateTime).toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</p>
                <p>Please contact the client to confirm the consultation time.</p>
            `,
        };

        // You can also send a confirmation email to the client if you want
         const mailOptionsClient = {
             from: process.env.EMAIL_USER,
            to: consultationEmail,
             subject: `Confirmation of Your Consultation Request with Touch Domain`,
             html: `
                 <p>Hi ${consultationName},</p>
                 <p>Thank you for booking a consultation with us. We have received your request and will contact you shortly to confirm the details.</p>
                 <p>Best regards,<br>The Touch Domain Team</p>
             `,
         };

        await transporter.sendMail(mailOptionsAdmin);
        await transporter.sendMail(mailOptionsClient); // Uncomment this if you want to send a client confirmation

        console.log('Consultation request email sent successfully.');

        // Respond to the client with a success message
        res.status(200).json({ message: 'Your consultation request has been submitted successfully! We will contact you shortly to confirm.' });

    } catch (error) {
        console.error('Error processing consultation request:', error);
        res.status(500).json({ message: 'Failed to submit consultation request. An internal server error occurred.' });
    }
});

// NEW: Define your package data here
// This is a crucial step. It links the package ID from the button to the actual services and prices.
const PACKAGE_DATA = {
    'launch-pad': {
        name: 'Launch Pad Package',
        price: 2500,
        services: [
            { name: 'Primary logo Design', value: 'Enabled' },
            { name: 'Logo Variations', value: '2 Logo Variations' },
            { name: 'Color Palette Definition', value: 'Primary and Secondary colors' },
            { name: 'Typography Selection', value: 'Enabled' },
            { name: 'Basic Brand Board', value: 'Enabled' },
            { name: 'Essential Digital Assests', value: '2 - 3 Social Media Platforms' }
        ]
    },
    'pinnacle-identity': {
        name: 'Pinnacle Identity Package',
        price: 6800,
        services: [
            { name: 'The Elevate & Expand Package', value: 'Enabled' },
            { name: 'In-depth Brand Strategy Workshop', value: 'Enabled' },
            { name: 'Extensive Imagery Guidelines', value: 'Enabled' },
            { name: 'Custom Graphic Elements & Patterns', value: 'Enabled' },
            { name: 'Corporate Presentation Template', value: 'Enabled' },
            { name: 'Brand Voice & Messaging Guidelines', value: 'Enabled' }
        ]
    },
    'elevate-expand': {
        name: 'Elevate & Expand Package',
        price: 4500,
        services: [
            { name: 'The Launchpad Package', value: 'Enabled' },
            { name: 'Comprehensive Brand Style Guide', value: 'Enabled' },
            { name: 'Full Stationery Suite', value: 'Enabled' },
            { name: 'Social Media Kit', value: '3 - 5 Post Templates' },
            { name: 'Basic Iconography Set', value: 'Enabled' },
            { name: 'Marketing Collateral Design', value: '1 Item' }
        ]
    },
    'digital-launchpad': {
        name: 'Digital Launch Pad Package',
        price: 3500,
        services: [
            { name: 'Custom Website Design', value: '1 - 5 pages' },
            { name: 'Responsive Web Development', value: 'Enabled' },
            { name: 'Basic Content Integration', value: 'Enabled' },
            { name: 'Initial SEO Setup', value: 'Enabled' },
            { name: 'Contact Form Integration', value: 'Enabled' }
        ]
    },
    'digital-dominator': {
        name: 'Digital Dominator Package',
        price: 6500,
        services: [
            { name: 'The Online Accelerator Package', value: 'Enabled' },
            { name: 'Custom Website Design', value: '15+ Pages' },
            { name: 'Advanced E-commerce Solutions', value: 'Enabled' },
            { name: 'API Integrations', value: 'Enabled' },
            { name: 'Performance Optimization', value: 'Enabled' },
            { name: 'Advanced SEO', value: 'Enabled' },
            { name: 'Post-Launch Support', value: 'Enabled' },
            { name: 'Training & Handover Session', value: 'Enabled' }
        ]
    },
    'online-accelerator': {
        name: 'Online Accelerator Package',
        price: 4890,
        services: [
            { name: 'The Digital Launchpad Package', value: 'Enabled' },
            { name: 'Custom Website Design', value: 'Up to 10 pages' },
            { name: 'Advanced UI/UX Enhancements', value: 'Enabled' },
            { name: 'E-commerce Integration', value: 'Enabled' },
            { name: 'Content Management System Setup', value: 'Enabled' },
            { name: 'Blog Section Integration', value: 'Enabled' },
            { name: 'Social Media Feed Integration', value: 'Enabled' }
        ]
    },
    'storyteller-starter': {
        name: 'Storyteller Starter Package',
        price: 4890,
        services: [
            { name: 'The Digital Launchpad Package', value: 'Enabled' },
            { name: 'Custom Website Design', value: 'Up to 10 pages' },
            { name: 'Advanced UI/UX Enhancements', value: 'Enabled' },
            { name: 'E-commerce Integration', value: 'Enabled' },
            { name: 'Content Management System Setup', value: 'Enabled' },
            { name: 'Blog Section Integration', value: 'Enabled' },
            { name: 'Social Media Feed Integration', value: 'Enabled' }
        ]
    },
    'narrative-designer': {
        name: 'Narrative Designer Package',
        price: 8200,
        services: [
            { name: 'The Impact Maximizer Package', value: 'Enabled' },
            { name: 'Full Digital Content Strategy', value: 'Enabled' },
            { name: 'Explainer Video', value: '1' },
            { name: 'Interactive Content Element', value: '1' },
            { name: 'Motion Graphics & Animated Logos', value: '1' },
            { name: 'Priority Content Consultation', value: 'Enabled' },
            { name: 'Custom Branded Templates', value: 'Enabled' }
        ]
    },
    'impact-maximizer': {
        name: 'Impact Maximizer Package',
        price: 4890,
        services: [
            { name: 'The Storyteller Starter Package', value: 'Enabled' },
            { name: 'In-depth Content Calendar & Planning', value: 'Enabled' },
            { name: 'Social Media Video', value: '1' },
            { name: 'Infographic Design', value: '1' },
            { name: 'Custom Iconography Set', value: '5-7 icons' },
            { name: 'Newsletter Header Design ', value: '1' }
        ]
    },
};



async function sendQuoteEmail(clientEmail, clientName, packageDetails, pdfBuffer) {
    try {
        // Mail options for the client
        const clientMailOptions = {
            from: process.env.EMAIL_USER,
            to: clientEmail,
            subject: `Your Quote for the ${packageDetails.name} from Touch Domain`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="text-align: center; padding-bottom: 20px;">
                        <img src="cid:logo_image" alt="Touch Domain Logo" style="max-width: 150px; height: auto;">
                    </div>
                    <p style="font-size: 16px; color: #333;">Hi ${clientName},</p>
                    <p style="font-size: 16px; color: #333;">Thank you for your interest in the <strong>${packageDetails.name}</strong> package. Please find your quote attached to this email.</p>
                    <p style="font-size: 16px; color: #333;">We will be in touch shortly to discuss your project in more detail.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
                        <p style="font-size: 12px; color: #777; text-align: center;"><strong>Disclaimer:</strong> This quotation is an estimate. The final price will be determined after a detailed consultation to assess the full scope of your project requirements.</p>
                    </div>
                    <p style="font-size: 16px; color: #333;">Best regards,<br>The Touch Domain Team</p>
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777;">
                        <a href="${process.env.APP_WEBSITE_URL}" style="color: #007BFF; text-decoration: none;">${process.env.APP_WEBSITE_URL}</a>
                    </div>
                </div>
            `,
            attachments: [{
                filename: `Quote_${clientName.replace(/ /g, '_')}_${packageDetails.name.replace(/ /g, '_')}.pdf`,
                content: pdfBuffer,
                contentType: 'application/pdf'
            },
            {
                // This is the new logo attachment
                filename: 'logo-nav.png', // Or whatever your logo filename is
                path: path.join(__dirname, 'branding/logo-nav.png'), // Update this path to your actual logo file
                cid: 'logo_image' // <-- This `cid` must match the `src="cid:..."` in your HTML   
            }]
        };
        
        // Mail options for the admin notification
        const adminMailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL,
            subject: `New Quote Request for ${packageDetails.name} from ${clientName}`,
            html: `
                <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <p style="font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-size: 16px; color: #333;">A new quote request has been submitted by <strong>${clientName}</strong> for the <strong>${packageDetails.name}</strong> package.</p>
                    <p style="font-size: 16px; color: #333;">Client Email: <strong>${clientEmail}</strong></p>
                    <p style="font-size: 16px; color: #333;">You can follow up with them at your convenience.</p>
                    <p style="font-size: 16px; color: #333;">Best regards,<br>Quote System</p>
                </div>
            `
        };

        // Send both emails concurrently
        await Promise.all([
            transporter.sendMail(clientMailOptions),
            transporter.sendMail(adminMailOptions)
        ]);
        
        console.log(`Package quote email sent successfully to ${clientEmail} and admin notification sent to ${process.env.ADMIN_EMAIL}`);
    } catch (error) {
        console.error('Error sending emails:', error);
        throw error; // Rethrow the error so the calling function can handle it
    }
}

// NEW: API Endpoint to handle package quote requests
app.post('/api/generate-package-quote', async (req, res) => {
    const { clientName, clientEmail, phoneNumber, packageId } = req.body;

    if (!clientName || !clientEmail || !packageId) {
        return res.status(400).json({ message: 'Name, email, and package selection are required.' });
    }

    const packageDetails = PACKAGE_DATA[packageId];
    if (!packageDetails) {
        return res.status(404).json({ message: 'Selected package not found.' });
    }

    let browser;
    try {
        // Build the HTML content for the PDF
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Quote from Touch Domain</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; color: #333; margin: 0; padding: 20px; line-height: 1.6; }
                    .header { text-align: right; margin-bottom: 40px; }
                    .header img { float: left; width: 100px; }
                    h1 { color: #452c63; font-size: 24px; border-bottom: 2px solid #9972ab; padding-bottom: 18px; margin-top: 0; }
                    h2 { color: #452c63; font-size: 20px; margin-top: 30px; }
                    .section { margin-bottom: 20px; }
                    .section-title { font-weight: bold; margin-bottom: 10px; border-left: 4px solid #9972ab; padding-left: 10px; }
                    .client-info p, .package-details p { margin: 5px 0; }
                    .service-list { list-style-type: none; padding-left: 0; }
                    .service-list li { margin-bottom: 5px; }
                    .total-price { text-align: center; font-size: 28px; font-weight: bold; color: #452c63; margin-top: 40px; }
                    .disclaimer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #777; }
                    .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #7f8c8d; }
                </style>
            </head>
            <body>
                <div class="header">
                    ${process.env.APP_LOGO_URL ? `<img src="${process.env.APP_LOGO_URL}" alt="Company Logo">` : ''}
                    <h1>Quote from Touch Domain</h1>
                    <p>Date: ${new Date().toLocaleDateString('en-ZA')}</p>
                </div>
                
                <div class="section client-info">
                    <div class="section-title">Client Information</div>
                    <p><strong>Client Name:</strong> ${clientName}</p>
                    <p><strong>Client Email:</strong> ${clientEmail}</p>
                    <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
                </div>
                
                <div class="section package-details">
                    <div class="section-title">Selected Package</div>
                    <p><strong>Package Name:</strong> ${packageDetails.name}</p>
                    <br>
                    <div class="section-title">Included Services</div>
                    <ul class="service-list">
                        ${packageDetails.services.map(service => `<li>- ${service.name}: ${service.value}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="total-price">
                    Total Quote Price: R${packageDetails.price.toFixed(2)}
                </div>

                <div class="disclaimer">
                    <strong>Disclaimer:</strong> This quotation is an estimation. The final price will be determined after a detailed consultation to assess the full scope of your project requirements.
                </div>
                
                <div class="footer">
                    Thank you for considering our services. We look forward to working with you!
                </div>
            </body>
            </html>
        `;

        // Launch a headless browser instance
        browser = await puppeteer.launch({
            headless: 'new', // Use the new headless mode
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recommended for production environments
        });
        const page = await browser.newPage();
        
        // Set the HTML content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });

        // Generate the PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // This is crucial for printing background colors and images
            margin: {
                top: '20mm',
                right: '20mm',
                bottom: '20mm',
                left: '20mm'
            }
        });
        
        // Call the reusable email sending function
        await sendQuoteEmail(clientEmail, clientName, packageDetails, pdfBuffer);

        res.status(200).json({ message: 'Your package quote has been sent to your email successfully!' });

    } catch (error) {
        console.error('Error in package quote generation:', error);
        res.status(500).json({ message: 'An internal server error occurred while processing your request.' });
    } finally {
        // This ensures the browser is closed even if an error occurs
        if (browser) {
            await browser.close();
        }
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access backend at: http://localhost:${port}`);
    console.log(`Current server time: ${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}`); // Log server time (SAST)
});
