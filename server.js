// server.js
const express = require('express');
const bodyParser = require('body-parser');
const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const app = express();
app.use(bodyParser.json()); // Parses JSON data
app.use(express.static('public')); // Serves static files from the 'public' folder

const mg = mailgun.client({
  username: 'api',
  key: '2d70d9462f260144cac3449804b7aff1-f6fe91d3-c361b0d5', // Replace with actual API key
});

const domain = 'sandbox647c03af97b94ac9be7c9f468cafedd3.mailgun.org'; // Replace with actual Mailgun domain

// Endpoint to handle subscription
app.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: 'Email is required' });
  }

  const data = {
    from: 'DEV@Deakin <mailgun@sandbox647c03af97b94ac9be7c9f468cafedd3.mailgun.org>',
    to: email,
    subject: 'Welcome to DEV@Deakin',
    text: 'Thank you for subscribing to DEV@Deakin!',
    html: '<h1>Welcome to DEV@Deakin!</h1><p>Thank you for subscribing to our platform.</p>',
  };

  try {
    const message = await mg.messages.create(domain, data);
    console.log('Email sent:', message);
    res.json({ success: true, message: 'Welcome email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.json({ success: false, message: 'Failed to send welcome email.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
