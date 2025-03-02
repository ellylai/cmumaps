const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const port = 80;

app.get('/', async (req, res) => {
  const firstBuilding = await prisma.building.findFirst();
  res.json(firstBuilding);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
