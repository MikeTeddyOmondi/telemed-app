const { pool } = require("../database/init");
const { createError } = require("../utils/createError");

const publicApiRoute = require("express").Router();

publicApiRoute.post("/", async (req, res, next) => {
  const { firstName, lastName, email, phoneNumber, message } = req.body;

  try {
    // db connection
    const db = pool();

    // create new contact
    const createNewContactStatement = `
        INSERT INTO contacts (first_name, last_name, email, phone_number, message) 
        VALUES (?, ?, ?, ?, ?);
    `;
    const [result] = await db.query(createNewContactStatement, [
      firstName,
      lastName,
      email,
      phoneNumber,
      message,
    ]);

    return res
      .status(200)
      .json({ success: true, data: { contactId: result.insertId } });

  } catch (error) {
    return next(createError(500, "Something went wrong", "INTERNAL_SERVER_ERROR"));
  }
});

module.exports = publicApiRoute;
