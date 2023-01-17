//importing dependencies
const nodemailer = require("nodemailer");
const multer = require("multer");
const fs = require("fs");

const bodyParser = require("body-parser");
const express = require("express");
//initializing app to express
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var to;
var subject;
var body;
//path for image
var path;
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./images");
  },
  //assigns unique filename to uploaded images
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  },
});

var upload = multer({
  storage: storage,
}).single("image");

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

app.post("/sendemail", (req, res) => {
  //execute this middleware to upload the image
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      return res.end("Something went wrong");
    } else {
      to = req.body.to;
      subject = req.body.subject;
      body = req.body.body;

      path = req.file.path;

      console.log(to);
      console.log(subject);
      console.log(body);
      console.log(path);

      //email address sending the email
      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "jett50@ethereal.email",
          pass: "Mtggq5js5MbYjdtAgU",
        },
      });
      //email address receiving the email
      var mailOptions = {
        from: "jett50@ethereal.email",
        to: to,
        subject: subject,
        text: body,
        attachments: [
          {
            path: path,
          },
        ],
      };
      //sending out the email address
      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email Sent" + info.response);

          //delete image in folder
          fs.unlink(path, function (err) {
            if (err) {
              return res.end(err);
            } else {
              console.log("deleted");
              return res.redirect("/result.html");
            }
          });
        }
      });
    }
  });
});

app.listen(5000, () => {
  console.log("App started on port 5000");
});
