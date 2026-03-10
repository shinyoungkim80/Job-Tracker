import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProspectSchema, STATUSES, INTEREST_LEVELS } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/prospects", async (_req, res) => {
    const prospects = await storage.getAllProspects();
    res.json(prospects);
  });

  app.post("/api/prospects", async (req, res) => {
    const parsed = insertProspectSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map((e) => e.message).join(", ") });
    }
    const prospect = await storage.createProspect(parsed.data);
    res.status(201).json(prospect);
  });

  app.patch("/api/prospects/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prospect ID" });
    }

    const existing = await storage.getProspect(id);
    if (!existing) {
      return res.status(404).json({ message: "Prospect not found" });
    }

    const body = req.body;
    const updates: Record<string, unknown> = {};

    const merged = { ...existing, ...req.body };
    const parsed = insertProspectSchema.safeParse(merged);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors.map((e) => e.message).join(", ") });
    }

    if (body.companyName !== undefined) updates.companyName = parsed.data.companyName;
    if (body.roleTitle !== undefined) updates.roleTitle = parsed.data.roleTitle;
    if (body.jobUrl !== undefined) updates.jobUrl = parsed.data.jobUrl;
    if (body.notes !== undefined) updates.notes = parsed.data.notes;
    if (body.salaryCurrency !== undefined) updates.salaryCurrency = parsed.data.salaryCurrency;
    if (body.salaryAmount !== undefined) updates.salaryAmount = parsed.data.salaryAmount;

    if (body.status !== undefined) updates.status = parsed.data.status;

    if (body.interestLevel !== undefined || body.interest_level !== undefined) {
      updates.interestLevel = parsed.data.interestLevel;
    }

    const updated = await storage.updateProspect(id, updates);
    res.json(updated);
  });

  app.delete("/api/prospects/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid prospect ID" });
    }

    const deleted = await storage.deleteProspect(id);
    if (!deleted) {
      return res.status(404).json({ message: "Prospect not found" });
    }

    res.status(204).send();
  });

  return httpServer;
}
