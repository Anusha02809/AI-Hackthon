import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import csv from "csv-parser";
import Fuse from "fuse.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "pincode-dataset.csv");

let addresses = [];
let fuse = null;

const loadData = () => {
  return new Promise((resolve, reject) => {
    const rows = [];

    fs.createReadStream(DATA_PATH)
      .on("error", (err) => {
        reject(new Error(`Failed to read dataset at ${DATA_PATH}: ${err.message}`));
      })
      .pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        addresses = rows;
        resolve();
      })
      .on("error", reject);
  });
};

// Load once at startup so every request reuses the same in-memory index.
await loadData();

fuse = new Fuse(addresses, {
  keys: ["officename", "district", "statename", "pincode"],
  threshold: 0.35,
  includeScore: true,
});

/**
 * Search the pincode dataset for the closest matching address.
 * Returns a single normalized result (or null if nothing matches).
 */
export const searchAddress = async (query) => {
  if (!fuse) {
    throw new Error("Address dataset is not ready yet");
  }

  const matches = fuse.search(query, { limit: 5 });

  if (matches.length === 0) {
    return null;
  }

  const best = matches[0];
  const row = best.item;

  // Fuse's score is 0 (perfect) to 1 (worst match); convert to a 0-100 confidence.
  const confidence = Math.round((1 - (best.score ?? 1)) * 100);

  return {
    cleaned_address: query,
    officename: row.officename,
    district: row.district,
    statename: row.statename,
    pincode: row.pincode,
    latitude: row.latitude ? Number(row.latitude) : null,
    longitude: row.longitude ? Number(row.longitude) : null,
    confidence,
    evidence: matches.slice(1).map((m) => ({
      key: "alternate match",
      value: `${m.item.officename}, ${m.item.district}, ${m.item.statename} - ${m.item.pincode}`,
    })),
  };
};
