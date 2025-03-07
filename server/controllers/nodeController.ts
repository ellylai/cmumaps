import type { Request, Response } from "express";
import { nodeService } from "../services/nodeService.ts";
import { floorService } from "../services/floorService.ts";
import { handleControllerError } from "../errors/errorHandler.ts";

export const nodeController = {
  createNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const sid = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.createNode(sid, floorCode, nodeId, nodeInfo, placement);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "creating node");
    }
  },

  deleteNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const socketId = req.socketId;

    try {
      await nodeService.deleteNode(socketId, nodeId);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "deleting node");
    }
  },

  updateNode: async (req: Request, res: Response) => {
    const nodeId = req.params.id;
    const { floorCode, nodeInfo } = req.body;
    const sid = req.socketId;

    try {
      const placement = await floorService.getFloorPlacement(floorCode);
      await nodeService.updateNode(sid, floorCode, nodeId, nodeInfo, placement);
      res.json(null);
    } catch (error) {
      handleControllerError(res, error, "updating node");
    }
  },
};
