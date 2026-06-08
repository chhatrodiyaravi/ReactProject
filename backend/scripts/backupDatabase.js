import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "../config/database.js";

dotenv.config({ path: ".env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, "..", "backups");
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const defaultOutputFile = path.join(
  outputDir,
  `foodhub-backup-${timestamp}.json`,
);

const getOutputFile = () => {
  const outputIndex = process.argv.indexOf("--output");
  if (outputIndex !== -1 && process.argv[outputIndex + 1]) {
    return path.resolve(process.argv[outputIndex + 1]);
  }

  return defaultOutputFile;
};

const backupDatabase = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not set in the environment");
    }

    const conn = await connectDB();
    const outputFile = getOutputFile();
    const targetDir = path.dirname(outputFile);

    fs.mkdirSync(targetDir, { recursive: true });

    const collections = await conn.connection.db.listCollections().toArray();
    const backup = {
      database: conn.connection.name,
      createdAt: new Date().toISOString(),
      collections: {},
    };

    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;

      if (collectionName.startsWith("system.")) {
        continue;
      }

      const documents = await conn.connection.db
        .collection(collectionName)
        .find({})
        .toArray();

      backup.collections[collectionName] = documents;
      console.log(
        `✓ Backed up ${documents.length} documents from ${collectionName}`,
      );
    }

    fs.writeFileSync(outputFile, JSON.stringify(backup, null, 2));
    console.log(`\n✓ Database backup saved to ${outputFile}`);

    await conn.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`✗ Backup failed: ${error.message}`);
    process.exit(1);
  }
};

backupDatabase();
