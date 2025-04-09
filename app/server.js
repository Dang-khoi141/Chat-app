// server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = "";
const authToken = "";
const verifyServiceSid = ""; 

const client = twilio(accountSid, authToken);


app.post("/send-code", async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify
      .v2.services(verifyServiceSid)
      .verifications.create({ to: `+84${phone.slice(1)}`, channel: "sms" });
    res.send({ success: true, status: verification.status });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});


app.post("/verify-code", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verification_check = await client.verify
      .v2.services(verifyServiceSid)
      .verificationChecks.create({
        to: `+84${phone.slice(1)}`,
        code,
      });

    res.send({
      success: verification_check.status === "approved",
      status: verification_check.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ success: false, error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
