const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
// Models
const Contact = require("./models/Conatct");
const Client = require("./models/Client");
const Instructor = require("./models/Instructor");

const app = express();
const port = process.env.PORT || 5000;

// server.js
const mongoose = require("mongoose");
app.use(bodyParser.json());

// Replace with your MongoDB Atlas connection string
const mongoURI =
  "mongodb+srv://arslanhaakim:epaECryNaHsLLV8m@cluster0.phkh3mz.mongodb.net/mydb";
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
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

app.use(cors());
app.use(bodyParser.json());

app.post("/send", (req, res) => {
  const { name, email, phone, message } = req.body;
  console.log("request came here");
  const transporter = nodemailer.createTransport({
    // service: "gmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "allamalquraan@hotmail.com",
    to: "arslandogar444@gmail.com",
    subject: "Allamal Quraan: New Contact Form Submission ",
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    console.log("in the send mail request");
    if (error) {
      console.log("Error sending email:", error);
      return res.status(500).send("Internal Server Error");
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Email sent successfully!");
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
