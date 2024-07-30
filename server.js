const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

// Models
const Contact = require("./models/Contact"); // Fixed typo here
const Client = require("./models/Client");
const Instructor = require("./models/Instructor");

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from the public directory
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(
  cors({
    origin: "*", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow these HTTP methods
  })
);

app.options("*", cors());

// Handle favicon requests
app.get("/favicon.ico", (req, res) => res.status(204));

// MongoDB connection
const mongoURI =
  "mongodb+srv://arslanhaakim:epaECryNaHsLLV8m@cluster0.phkh3mz.mongodb.net/mydb";
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
  const { name, email, phone, message } = req.body;

  // Save to MongoDB
  const contact = new Contact(req.body);
  try {
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
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully!");
  });
});

// Other endpoints
app.post("/api/contacts", async (req, res) => {
  const contact = new Contact(req.body);
  await contact.save();
  res.status(201).send(contact);
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
