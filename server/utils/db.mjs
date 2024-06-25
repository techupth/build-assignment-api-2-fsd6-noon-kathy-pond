// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.defaults;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:PondDoy1123@localhost:5432/Build the Complete CRUD APIs",
});

export default connectionPool;
