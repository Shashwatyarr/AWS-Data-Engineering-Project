const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const parquet = require("parquetjs-lite");

exports.handler = async (event) => {
  try {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key);

    console.log("File:", key);

    const file = await s3.getObject({ Bucket: bucket, Key: key }).promise();
    const csv = file.Body.toString("utf-8");

    const lines = csv.split("\n");
    const headers = lines[0].split(",");

    let rows = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      let values = lines[i].split(",");
      let obj = {};

      headers.forEach((h, idx) => {
        obj[h.trim()] = values[idx];
      });

      // ✅ CLEANING
      let marks = parseInt(obj.marks) || 0;
      let attendance = parseInt(obj.attendance) || 0;

      // ✅ TRANSFORMATION
      let grade = "F";
      if (marks >= 90) grade = "A";
      else if (marks >= 75) grade = "B";
      else if (marks >= 50) grade = "C";

      rows.push({
        student_id: parseInt(obj.student_id) || 0,
        name: obj.name,
        branch: obj.branch,
        semester: parseInt(obj.semester) || 0,
        subject: obj.subject,
        marks,
        attendance,
        exam_date: obj.exam_date,
        grade,
      });
    }

    // 🔥 PARQUET SCHEMA
    const schema = new parquet.ParquetSchema({
      student_id: { type: "INT64" },
      name: { type: "UTF8" },
      branch: { type: "UTF8" },
      semester: { type: "INT64" },
      subject: { type: "UTF8" },
      marks: { type: "INT64" },
      attendance: { type: "INT64" },
      exam_date: { type: "UTF8" },
      grade: { type: "UTF8" },
    });

    const writer = await parquet.ParquetWriter.openFile(schema, "/tmp/output.parquet");

    for (let row of rows) {
      await writer.appendRow(row);
    }

    await writer.close();

    // Upload parquet to S3
    const fs = require("fs");

    const fileStream = fs.readFileSync("/tmp/output.parquet");

    await s3.putObject({
      Bucket: bucket,
      Key: "processed/data.parquet",
      Body: fileStream,
    }).promise();

    console.log("Parquet uploaded");

    return { statusCode: 200 };

  } catch (err) {
    console.error(err);
    throw err;
  }
};