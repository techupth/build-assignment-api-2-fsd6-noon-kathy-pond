import express from "express";
import connectionPool from "./utils/db.mjs";
import 'dotenv/config';

const app = express();
const port = 4001;

app.use(express.json());

app.get("/assignments", async (req, res) => {
  let results
  try {
    results = await connectionPool.query(`select * from assignments`);
  } catch {
    return res.status(500).json({
      message: 'Server could not read assignment because database connection',
      });
  }
  return res.status(200).json({
    data: results.rows,
  });
});

app.get("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;

  const results = await connectionPool.query(
    `select * from assignments where assignment_id=$1`, [assignmentIdFromClient]
  );
if (!results.rows[0]) {
  return res.status(404).json({
    message: `Server could not find a requested assignment (assignment id: ${assignmentIdFromClient})`,
    });
}
  return res.status(200).json({
    data: results.rows[0],
  });
});

app.put("/assignments/:assignmentId", async (req, res) => {
  try {
  const assignmentIdFromClient = req.params.assignmentId
  const updatedAssignment = {...req.body, updated_at: new Date()};

  await connectionPool.query(
    `
    update assignments
    set title = $2,
        content = $3,
        category = $4,
        updated_at = $5
    where assignment_id = $1
    `,
    [
      assignmentIdFromClient,
      updatedAssignment.title,
      updatedAssignment.content,
      updatedAssignment.category,
      updatedAssignment.updated_at,
    ]
  );
    } catch {
    return res.status(404).json({
      message: `Server could not find a requested assignment to update`,
      });
  }
  return res.status(200).json({
    message: "Updated assignment sucessfully",
  });
});

app.delete("/assignments/:assignmentId", async (req, res) => {
  try {
  const assignmentIdFromClient = req.params.assignmentId;
  await connectionPool.query(
    `delete from assignments
     where assignment_id = $1`,
     [assignmentIdFromClient]
  );
  } catch {
    return res.status(404).json({
      message: `Server could not find a requested assignment to delete`,
      });
  }
  return res.status(200).json({
    message: "Deleted assignment sucessfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
