// Start coding here
import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsMockDatabase = [...assignments];
let commentsMockDatabase = [...comments];

const app = express();
const port = 4001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/assignments", (req, res) => {
  const limit = req.query.limit;

  if (limit > 10) {
    return res.status(401).json({
      message: "Invalid request,limit must not exceeds 10 assignments",
    });
  }

  const assignmentsResult = assignmentsMockDatabase.slice(0, limit);

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentsResult,
  });
});

app.get("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const assignmentData = assignmentsMockDatabase.filter(
    (item) => item.id === assignmentIdFromClient
  );

  return res.json({
    message: "Complete Fetching assignments",
    data: assignmentData[0],
  });
});

app.post("/assignments", (req, res) => {
  assignmentsMockDatabase.push({
    id: assignmentsMockDatabase[assignmentsMockDatabase.length - 1].id + 1,
    ...req.body,
  });

  return res.json({
    message: "New assignment has been created successfully",
    data: assignmentsMockDatabase[assignmentsMockDatabase.length - 1],
  });
});

app.delete("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({ message: "Cannot delete, No data available!" });
  }

  const newAssignments = assignmentsMockDatabase.filter((item) => {
    return item.id !== assignmentIdFromClient;
  });

  assignmentsMockDatabase = newAssignments;

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been deleted successfully`,
  });
});

app.put("/assignments/:assignmentId", (req, res) => {
  const assignmentIdFromClient = Number(req.params.assignmentId);

  const updateAssignments = { ...req.body };

  const hasFound = assignmentsMockDatabase.find((item) => {
    return item.id === assignmentIdFromClient;
  });

  if (!hasFound) {
    return res.json({
      message: "Cannot update, No data available!",
    });
  }

  // หา Index ของข้อมูลใน Mock Database เพื่อที่จะเอามาใช้ Update ข้อมูล
  const assignmentIndex = assignmentsMockDatabase.findIndex((item) => {
    return item.id === assignmentIdFromClient;
  });

  assignmentsMockDatabase[assignmentIndex] = {
    id: assignmentIdFromClient,
    ...updateAssignments,
  };

  return res.json({
    message: `Assignment Id : ${assignmentIdFromClient}  has been updated successfully`,
    data: assignmentsMockDatabase[assignmentsMockDatabase.length - 1],
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
