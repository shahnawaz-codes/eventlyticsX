import express from "express";
import { tracking } from "./analytics.controller";

const route = express.Router();

route.post("/track", tracking);

export default route;
