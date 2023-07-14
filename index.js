const axios = require("axios");
const Joi = require("joi");
const dotenv = require("dotenv").config();

module.exports = async (req, res) => {
  // Validation schema
  const schema = Joi.object({
    Answer1: Joi.string().required(),
    Answer2: Joi.string().required(),
    Answer3: Joi.string().required(),
    Answer4: Joi.string().required(),
  });

  // Validate request body
  const { error, value } = schema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // CORS
  const allowedOrigins = [
    "https://buzzfeed-style-quiz.rileyrichter.com",
    "https://buzzfeed-style-quiz.webflow.io",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Set additional CORS headers
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Airtable API request
  const data = {
    records: [
      {
        fields: {
          Answer1: value.Answer1,
          Answer2: value.Answer2,
          Answer3: value.Answer3,
          Answer4: value.Answer4,
        },
      },
    ],
  };

  const config = {
    headers: {
      Authorization: process.env.AIRTABLE_API_KEY,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(
      "https://api.airtable.com/v0/apppR8bnHCjIWXIY8/quiz",
      data,
      config
    );
    res.json(response.data.records[0].fields);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred trying to process your request");
  }
};
