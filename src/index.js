import express from "express";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import colorRoutes from "./routes/colorRoute.js";
import brandRoutes from "./routes/brandRoute.js";
import AppError from "./utils/appError.js";
import globalError from "./controllers/errorController.js";
import reviewRouter from "./routes/reviewRoute.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/product", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/color", colorRoutes);
app.use("/api/v1/brand", brandRoutes);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalError);

export default app;
