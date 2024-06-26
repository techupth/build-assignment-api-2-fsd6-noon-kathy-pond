import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4001;

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});
// get all
app.get("/assignments", async (req, res) => {
  let result;
  try {
    result = await connectionPool.query(`select * from assignments`);
  } catch (error) {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({ data: result.rows });
});

// get by id
app.get("/assignments/:assignmentId", async (req, res) => {
  let result;
  try {
    const getById = req.params.assignmentId;
    result = await connectionPool.query(
      `select * from assignments where assignment_id = $1 `,
      [getById]
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({ data: result.rows[0] });
});

// put
app.put("/assignments/:assignmentId", async (req, res) => {
  const assignmentIdFromClient = req.params.assignmentId;
  const updatedAssignment = {
    ...req.body,
    updated_at: new Date(),
  };
  let resultz
  try {

   resultz = await connectionPool.query(
      
      `UPDATE assignments
      SET title = $2,
          content = $3,
          category = $4,
          length = $5,
          status = $6,
          updated_at = $7
      WHERE assignment_id = $1`
      ,
      [
        assignmentIdFromClient,
        updatedAssignment.title,
        updatedAssignment.content,
        updatedAssignment.category,
        updatedAssignment.length,
        updatedAssignment.status,
        updatedAssignment.updated_at,
      ]
    );
    if (resultz.rowsCount === 0) {
      return res.status(404).json({
        message: "Server could not find the requested assignment to update",
      });
    }
    console.log('abc',resultz)
    return res.status(200).json({ message: "Updated assignment successfully" });
  } catch (error) {
    console.error("Error updating assignment:", error);
    return res.status(500).json({
      message: "Server could not update assignment due to a database error",
    });
  }
});
// delete
app.delete("/assignments/:assignmentId", async (req, res) => {
  const  deleteId = req.params.assignmentId
  let result;
  try {
    result = await connectionPool.query(`delete from assignments where assignment_id = $1`,[deleteId]);
    if (result.rowsCount === 0) {
      return res.status(404).json({
        message: "Server could not find the requested assignment to update",
      });
  }}
   catch (error) {
    return res.status(500).json({
      message: "Server could not read assignment because database connection",
    });
  }
  return res.status(200).json({  "message": "Deleted assignment sucessfully" });
});


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
