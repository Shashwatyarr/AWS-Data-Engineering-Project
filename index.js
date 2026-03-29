const express = require("express");
const AWS = require("aws-sdk");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ⚠️ IMPORTANT: apni keys yahan mat hardcode karo (env use karo ideally)
AWS.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
});

const athena = new AWS.Athena();

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

app.post("/query", async (req, res) => {
  const { query } = req.body;

  console.log("Incoming Query:", query);

  // ❌ empty query check
  if (!query) {
    return res.status(400).json({ error: "Query is empty" });
  }

  const params = {
    QueryString: query,

    // 🔥 FIX 1: DATABASE CONTEXT
    QueryExecutionContext: {
      Database: "default",
    },

    // 🔥 FIX 2: OUTPUT LOCATION
    ResultConfiguration: {
      OutputLocation: "s3://student-dataset--bucket/processed/",
    },

    // 🔥 FIX 3: WORKGROUP
    WorkGroup: "primary",
  };

  try {
    // 1️⃣ Start query
    const start = await athena.startQueryExecution(params).promise();
    const executionId = start.QueryExecutionId;

    let status = "RUNNING";
    let resStatus;

    // 2️⃣ Wait for completion
    while (status === "RUNNING" || status === "QUEUED") {
      await sleep(1000);

      resStatus = await athena
        .getQueryExecution({ QueryExecutionId: executionId })
        .promise();

      status = resStatus.QueryExecution.Status.State;
    }

    // ❌ If failed
    if (status !== "SUCCEEDED") {
      console.log("ATHENA ERROR:", resStatus.QueryExecution.Status);

      return res.status(500).json({
        error: "Query failed",
        details: resStatus.QueryExecution.Status.StateChangeReason,
      });
    }

    // 3️⃣ Get results
    const result = await athena
      .getQueryResults({ QueryExecutionId: executionId })
      .promise();

    const rows = result.ResultSet.Rows;

    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // headers
    const headers = rows[0].Data.map(
      (col) => col?.VarCharValue || ""
    );

    // data parsing (SAFE)
    const data = rows.slice(1).map((row) => {
      let obj = {};

      row.Data.forEach((cell, i) => {
        obj[headers[i]] = cell?.VarCharValue || "";
      });

      return obj;
    });

    res.json(data);

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});