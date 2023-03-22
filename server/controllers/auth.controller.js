const config = require("../config/auth.config");
const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = db.users;

exports.login = [
  // input validation using express-validator
  body("username").notEmpty().trim().escape(),
  body("password").notEmpty().trim(),

  (req, res) => {
    // check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // retrieve user from the database using a parameterized query with prepared statements
    User.findOne({ username: req.body.username })
      .select("+password")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User does not exist" });
        }

        // validate password
        const isPwCorrect = bcrypt.compareSync(req.body.password, user.password);

        if (!isPwCorrect) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid password!",
          });
        }

        // generate JWT token
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400,
        });

        res.status(200).send({
          id: user._id,
          username: user.username,
          accessToken: token,
        });
      });
  },
];
