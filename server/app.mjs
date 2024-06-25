import express from "express";
import { pool } from "./utils/db.mjs"

const app = express();
const port = 4001;

app.get("/test", (req, res) => {
  return res.json("Server API is working 🚀");
});

app.get("/assignments/:assignmentId", async (req, res) => {
  const assignFronCrlient = req.params.postId
  const result = await pool.query(`select * from assignments where assingment_id=$1`, [assignFronCrlient])
  try {
    await pool.query(`select * from assignments where assingment_id=$1`, [assignFronCrlient])
    if (!result.row[0]) {
      return res.status(404).json({
        message: `Server could not find a requested assignment (assingment_id: ${assignFronCrlient})`
      })
    }
    return res.status(200).json({
      data: [{ assignment_data_1 }, { assignment_data_2 }, { assignment_data_3 }]

    })

  } catch {
    return res.status(500).json({
      message: "Server could not read assignment because database connection"
    })
  }
})

app.put("/assignments/:assignmentId", async (req, res) => {
  const assignIdFronCrlient = req.params.assignmentId
  const updateAssignment = { ...req.body, updated_at: new Date() }
  const result = await pool.query(`select * from assignments where assingment_id=$1`, [assignIdFronCrlient])

  try {
    await pool.query(`
      update assignment
      set title = $2
          content = $3
          category = $4
          length = $5
          status =$6
          updated_at = $8
      where assignment_id = $1
      `, [
      assignIdFronCrlient,
      updateAssignment.title,
      updateAssignment.content,
      updateAssignment.category,
      updateAssignment.length,
      updateAssignment.status,
      updateAssignment.updated_at,
    ])
    if (!result.row[0]) {
      return res.status(500).json({
        message: "Server could not update assignment because database connection"
      })
    }
    return res.status(200).json({
      message: "Updated assignment sucessfully"
    })
  } catch {
    return res.status(404).json({
      message: "Server could not find a requested assignment to update"
    })
  }
})


app.delete("/assignments/:assignmentId", async (req, res) =>{
  const assignIdFronCrlient = req.params.assignmentId
  const result = await pool.query(`select * from assignments where assingment_id=$1`, [assignIdFronCrlient])
  try {
    await pool.query(
      `delete from assignments where assignmrnt_id = $1`,[assignIdFronCrlient] )
      if (!result.row[0]) {
        return res.status(500).json({
          message: "Server could not delete assignment because database connection" 
      })
    }
      return res.status(200).json({
        message: "Deleted assignment sucessfully"
      })
  }catch {
    return res.status(404).json({
      message: "Server could not delete assignment because database connection"
    })
  }
})


app.listen(port, () => {
  console.log(`Server is running at ${port}`);
})
