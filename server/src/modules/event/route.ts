import express from "express";
import { tracking } from "./controller.js";

const route = express.Router();
//route
route.post("/track", tracking);

export default route;
