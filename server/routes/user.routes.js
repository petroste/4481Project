const { authJwt } = require("../auth");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("../../client/helpdesk/tempchat", [authJwt.verifyToken], (req, res) => {
    res.status(200).send();
  });

};