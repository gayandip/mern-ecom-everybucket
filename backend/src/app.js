import express from "express";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import { userRouter } from "./routes/user.routes.js";
import { storeRouter } from "./routes/store.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/stores", storeRouter);

export { app };
