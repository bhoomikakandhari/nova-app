const express = require("express");
const prisma = require("../prismaClient");
const requireAuth = require("../middleware/auth");

const router = express.Router();


router.use(requireAuth);


router.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: req.userId },
        { members: { some: { userId: req.userId } } },
      ],
    },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      tasks: true,
    },
  });

  //  progress percentage per project
  const withProgress = projects.map((p) => {
    const total = p.tasks.length;
    const done = p.tasks.filter((t) => t.status === "done").length;
    return { ...p, progress: total === 0 ? 0 : Math.round((done / total) * 100) };
  });

  res.json(withProgress);
});

//  create a new project
router.post("/", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Project name is required" });

  const project = await prisma.project.create({
    data: { name, description, ownerId: req.userId },
  });

  res.status(201).json(project);
});

//  get one project with full detail

router.get("/:id", async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      members: { include: { user: { select: { id: true, name: true, email: true } } } },
      tasks: { include: { assignee: { select: { id: true, name: true } } } },
    },
  });

  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// POST /api/projects/:id/members — add a team member by email
router.post("/:id/members", async (req, res) => {
  const { email } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "No user found with that email" });

  const member = await prisma.projectMember.create({
    data: { projectId: Number(req.params.id), userId: user.id },
  });

  res.status(201).json(member);
});

module.exports = router;