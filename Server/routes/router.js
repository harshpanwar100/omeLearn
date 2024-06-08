const express = require("express");
const route = express.Router();
const services = require("../services/render");
const controller = require("../controller/controller");

route.get("/", services.home);
route.get("/home", services.chat);
route.post("/api/users", controller.create);
route.put("/leaving-user-update/:id", controller.leavingUserUpdate);
route.put("/new-user-update/:id" , controller.newUserUpdate);
route.post("/get-remote-users" , controller.getRemoteUsers);
route.put("/update-on-engagement/:id" , controller.updateOnEngagement);

module.exports = route; 