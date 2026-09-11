const express = require("express");
const prisma = require("../prismaClient");
const requireAuth = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// create a task under a project
router.post("/", async (req, res) => {
  const { title, description, projectId, assigneeId } = req.body;

  if (!title || !projectId) {
    return res.status(400).json({ error: "title and projectId are required" });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      projectId: Number(projectId),
      assigneeId: assigneeId ? Number(assigneeId) : null,
    },
  });

  res.status(201).json(task);
});

//  update task (title, description, status, assignee)
router.put("/:id", async (req, res) => {
  const { title, description, status, assigneeId } = req.body;

  const task = await prisma.task.update({
    where: { id: Number(req.params.id) },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(status !== undefined && { status }),
      ...(assigneeId !== undefined && { assigneeId: assigneeId ? Number(assigneeId) : null }),
    },
  });

  res.json(task);
});

// DELETE 
router.delete("/:id", async (req, res) => {
  await prisma.task.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

module.exports = router;