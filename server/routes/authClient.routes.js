const ctrl = require("../controllers/authClient.controller");


module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post("/getAgent", ctrl.getAgentToConnect);

    app.post("/getCustomerList", ctrl.getCustomerList);

    app.post("/assign", ctrl.assignCustomerToAgent);

};
