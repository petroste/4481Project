const config = require("../config/auth.config");
const db = require("../models");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const User = db.users;

exports.login = (req, res) => {
    User.findOne({username: req.body.username})
        .exec((err, user) => {
            if (err)
            {
                res.status(500).send({message: err});
                return;
            }
            if (!user)
            {
                return res.status(404).send({message: "User does not exist"});
            }

            var isPwCorrect = bcrypt.compareSync(req.body.password, user.password);

            if (!isPwCorrect)
            {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid password!"
                });
            }

            var token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400});

            res.status(200).send({
                id: user._id,
                username: user.username,
                accessToken: token
            });
        });
};

