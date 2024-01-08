import express from "express";
import { assignments } from "./data/assignments.js";
import { comments } from "./data/comments.js";

let assignmentsMock = assignments;
let commentsMock = comments;

const app = express();
const port = 4000;

app.get("/assignments/:assignmentsId/comments", (req, res) => {
  let assignmentsIdFromUser = Number(req.params.assignmentsId);
  let commentsData = commentsMock.filter(
    (comment) => comment.assignmentId === assignmentsIdFromUser
  );

  if (commentsData.length === 0) {
    return res.status(404).json({
      message: "Comments not found for the provided ID",
      data: [],
    });
  }

  const assignment = commentsData.slice(0, 10);

  return res.json({
    message: "Complete Fetching Comments",
    data: commentsData,
  });
});

app.get("/assignments", (req, res) => {
  const limit = req.query.limit || 10;
  const totalAssignments = assignmentsMock.length;

  if (totalAssignments <= 10) {
    return res.json({
      message: "Complete Fetching Assignments",
      data: assignmentsMock,
    });
  } else {
    return res.status(400).json({
      message: "Invalid request, limit must not exceed 10 assignments",
    });
  }
});

app.get("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromUser = Number(req.params.assignmentsId);
  let assignmentsData = assignmentsMock.filter(
    (assignment) => assignment.id === assignmentsIdFromUser
  );

  if (assignmentsData.length === 0) {
    return res.status(404).json({
      message: "Assignment not found for the provided ID",
      data: [],
    });
  }

  return res.json({
    message: "Complete Fetching Assignments",
    data: assignmentsData,
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/assignments", (req, res) => {
  assignmentsMock.push(req.body);
  return res.json({
    message: "Assignment created successfully",
    data: assignmentsMock,
  });
});

app.delete("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromUser = Number(req.params.assignmentsId);
  let assignmentsBeforeDelete = assignmentsMock.length;
  assignmentsMock = assignmentsMock.filter(
    (assignment) => assignment.id !== assignmentsIdFromUser
  );

  if (assignmentsMock.length < assignmentsBeforeDelete) {
    return res.json({
      message: `Assignment ${assignmentsIdFromUser} deleted successfully`,
      deletedId: assignmentsIdFromUser,
    });
  } else {
    return res.status(404).json({
      message: "Assignment not found for the provided ID",
    });
  }
});

app.put("/assignments/:assignmentsId", (req, res) => {
  let assignmentsIdFromUser = Number(req.params.assignmentsId);
  let updatedAssignments = req.body;

  let newAssignmentsMock = assignmentsMock.map((assignment) => {
    if (assignment.id === assignmentsIdFromUser) {
      return updatedAssignments;
    }
    return assignment;
  });

  assignmentsMock = newAssignmentsMock;

  return res.json({
    message: "Assignment updated successfully",
    data: assignmentsMock,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
