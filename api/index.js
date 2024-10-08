const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// Models
const Contact = require("../models/Contact");
const Client = require("../models/Client");
const Instructor = require("../models/Instructor");

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static("public"));

app.use(bodyParser.json());

const corsOptions = {
  // origin: ["https://allamalquraan.com", "http://localhost:5173"],
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.options("*", cors());

// Handle favicon requests
app.get("/public/favicon.ico", (req, res) => res.status(204));

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).send("Something went wrong!");
});

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define a route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

// Endpoint to handle contact form submission
app.post("/send", async (req, res) => {
  console.log("welcome to the server");
  const { name, email, phone, message } = req.body;

  // Save to MongoDB
  const contact = new Contact(req.body);
  try {
    console.log("mongodb connection");
    await contact.save();
  } catch (err) {
    console.log("Error saving to MongoDB:", err);
    return res.status(500).send("Internal Server Error");
  }

  // Send email
  const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL_TO,
    subject: "Allamal Quraan: New Contact Form Submission",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log("email sending to", process.env.EMAIL_TO);
    console.log("welcome mail");
    if (error) {
      console.log("welcome error");
      console.log("Error sending email:", error);
      return res.status(500).send("Internal Server Error");
    }

    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully!");
  });
});

// Other endpoints
app.post("/api/contacts", async (req, res) => {
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).send(contact);
  } catch (err) {
    console.error("Error fetching contacts:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/clients", async (req, res) => {
  const client = new Client(req.body);
  await client.save();
  res.status(201).send(client);
});

app.post("/api/instructors", async (req, res) => {
  const instructor = new Instructor(req.body);
  await instructor.save();
  res.status(201).send(instructor);
});

app.get("/api/contacts", async (req, res) => {
  console.log("Request headers:", req.headers);
  console.log("Request body:", req.body);
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
