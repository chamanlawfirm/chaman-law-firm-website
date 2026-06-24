import fs from "node:fs";
import readline from "node:readline";
import zlib from "node:zlib";

const dumpPath = process.argv[2];
const query = (process.argv[3] || "").toLowerCase();

if (!dumpPath || !query) {
  console.error("Usage: node scripts/migration/phase5c-search-wp-posts.mjs <wordpress.sql.gz> <query>");
  process.exit(1);
}

function mysqlUnescape(value) {
  return value.replace(/\\([0btnrZ"'\\%_])/g, (_, code) => {
    switch (code) {
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      default:
        return code;
    }
  });
}

function parseMysqlTuple(line) {
  let value = line.trim().replace(/[;,]\s*$/, "");
  if (value.startsWith("(") && value.endsWith(")")) value = value.slice(1, -1);
  const fields = [];
  let cell = "";
  let inString = false;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if (inString) {
      if (char === "\\") {
        cell += char + (value[i + 1] || "");
        i += 1;
      } else if (char === "'") {
        inString = false;
      } else {
        cell += char;
      }
    } else if (char === "'") {
      inString = true;
    } else if (char === ",") {
      fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
      cell = "";
    } else {
      cell += char;
    }
  }
  fields.push(cell === "NULL" ? null : mysqlUnescape(cell));
  return fields;
}

let activeTable = null;
const rl = readline.createInterface({
  input: fs.createReadStream(dumpPath).pipe(zlib.createGunzip({ finishFlush: zlib.constants.Z_SYNC_FLUSH })),
  crlfDelay: Infinity
});

for await (const line of rl) {
  const insert = line.match(/^INSERT INTO `([^`]+)` VALUES/);
  if (insert) {
    activeTable = insert[1].replace(/^.*?_/, "");
    continue;
  }
  if (!activeTable || activeTable !== "posts" || !line.startsWith("(")) continue;
  const row = parseMysqlTuple(line);
  const post = {
    ID: Number(row[0]),
    post_date: row[2],
    title: row[5] || "",
    status: row[7] || "",
    slug: row[11] || "",
    type: row[20] || ""
  };
  const haystack = `${post.slug} ${post.title}`.toLowerCase();
  if (post.type === "post" && haystack.includes(query)) {
    console.log(JSON.stringify(post));
  }
  if (line.trim().endsWith(";")) activeTable = null;
}
