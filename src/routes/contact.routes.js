import express from "express"
import { contact } from "../controller"
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const contactRouter = express.Router()

contactRouter.post("/contact-us", contact)
export default contactRouter;
