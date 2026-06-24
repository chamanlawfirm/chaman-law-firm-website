import fs from "node:fs";
import readline from "node:readline";
import zlib from "node:zlib";

const dumpPath = process.argv[2];

if (!dumpPath) {
  console.error("Usage: node scripts/migration/phase5c-inspect-wp-dump.mjs <wordpress.sql.gz>");
  process.exit(1);
}

const wanted = new Set(["posts", "postmeta", "terms", "term_taxonomy", "term_relationships", "users"]);
const seen = new Set();
const createCapture = new Map();
let activeCreate = null;
let activeInsert = null;
const rl = readline.createInterface({
  input: fs.createReadStream(dumpPath).pipe(zlib.createGunzip({ finishFlush: zlib.constants.Z_SYNC_FLUSH })),
  crlfDelay: Infinity
});

for await (const line of rl) {
  const create = line.match(/^CREATE TABLE `([^`]+)`/);
  if (create) {
    const suffix = create[1].replace(/^.*?_/, "");
    if (wanted.has(suffix) && !seen.has(`create:${suffix}`)) {
      console.log(`CREATE ${create[1]}`);
      activeCreate = suffix;
      createCapture.set(suffix, []);
      seen.add(`create:${suffix}`);
    }
  }

  if (activeCreate) {
    createCapture.get(activeCreate)?.push(line);
    if (line.startsWith(") ENGINE=")) {
      const columns = createCapture
        .get(activeCreate)
        ?.map((item) => item.match(/^\s*`([^`]+)`/)?.[1])
        .filter(Boolean);
      console.log(`COLUMNS ${activeCreate} ${JSON.stringify(columns)}`);
      activeCreate = null;
    }
  }

  const insert = line.match(/^INSERT INTO `([^`]+)`/);
  if (insert) {
    const suffix = insert[1].replace(/^.*?_/, "");
    if (wanted.has(suffix) && !seen.has(`insert:${suffix}`)) {
      console.log(`INSERT ${insert[1]} sample=${line.slice(0, 500)}`);
      activeInsert = suffix;
      seen.add(`insert:${suffix}`);
    }
  }

  if (activeInsert && line.startsWith("(")) {
    console.log(`ROW_SAMPLE ${activeInsert} ${line.slice(0, 800)}`);
    activeInsert = null;
  }

  if (seen.size >= wanted.size * 2) {
    break;
  }
}
