import express from "express";
import { buildingController } from "../controllers/buildingController";
import { checkAuth } from "../middleware/authMiddleware";

const buildingRouter = express.Router();

buildingRouter.get("/", buildingController.getBuildings);

buildingRouter.get(
  "/codes-and-names",
  checkAuth,
  buildingController.getBuildingCodesAndNames,
);
buildingRouter.get("/:id/name", checkAuth, buildingController.getBuildingName);
buildingRouter.get(
  "/:id/defaultFloor",
  checkAuth,
  buildingController.getDefaultFloor,
);
buildingRouter.get(
  "/:id/floors",
  checkAuth,
  buildingController.getBuildingFloors,
);

export default buildingRouter;
