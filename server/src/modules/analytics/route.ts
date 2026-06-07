import express from "express";

const route = express.Router();

route.get("/analytics/overview");
route.get("/analytics");

export default route;
