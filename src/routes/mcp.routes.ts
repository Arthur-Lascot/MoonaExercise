import { Router, Request, Response } from "express";
import { clientToServerCommunication, handleSessionRequest } from "../controllers/mcp.controllers";

const router = Router();

router.post('', clientToServerCommunication);

router.get('', handleSessionRequest);

router.delete('', handleSessionRequest);

export default router;