import { UAParser } from "ua-parser-js";

const parser = new UAParser(
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36"
);

console.log(parser.getResult());