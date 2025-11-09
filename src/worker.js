// src/worker.js
import { faker } from "@faker-js/faker";

let masterList = [];

// --- Utility: Create one random customer ---
function createRandomCustomer(id) {
  return {
    id,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    score: faker.number.int({ min: 0, max: 100 }),
    lastMessageAt: faker.date.recent({ days: 30 }).toISOString(),
    addedBy: faker.person.fullName(),
    avatar: faker.image.avatar(),
  };
}

// --- Generate Customers in Chunks (non-blocking) ---
async function generateCustomers(count) {
  console.log(`Worker: Generating ${count} customers...`);
  const customers = [];

  // Generate in 10k record chunks to keep UI responsive
  const BATCH_SIZE = 100;

  for (let i = 0; i < count; i++) {
    customers.push(createRandomCustomer(i + 1));

    // After each batch, yield back control and send progress
    if ((i + 1) % BATCH_SIZE === 0) {
      postMessage({
        type: "PROGRESS",
        payload: { generated: i + 1, total: count },
      });
      await new Promise((r) => setTimeout(r, 0)); // yield to event loop
    }
  }

  console.log(`Worker: Generated ${count} customers.`);
  return customers;
}

// --- Sort Helper ---
function sortData(data, sortConfig) {
  if (!sortConfig?.key) return data;
  const { key, direction } = sortConfig;
  const order = direction === "asc" ? 1 : -1;

  // In-place sort for memory efficiency
  return data.sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA === valB) return 0;
    return valA > valB ? order : -order;
  });
}

// --- Main Worker Event Listener ---
self.onmessage = async (e) => {
  const { type, payload } = e.data;

  switch (type) {
    // Step 1: Generate data inside the worker
    case "INIT":
      console.log("Worker: Initializing dataset...");
      masterList = await generateCustomers(payload.count);
      postMessage({
        type: "INIT_COMPLETE",
        payload: { totalCount: masterList.length },
      });
      console.log("Worker: Initialization complete.");
      break;

    // Step 2: Filter + Sort dataset
    case "PROCESS": {
      const { searchTerm, sortConfig } = payload;
      const lowerSearch = (searchTerm || "").toLowerCase();

      const filtered = lowerSearch
        ? masterList.filter(
            (c) =>
              c.name.toLowerCase().includes(lowerSearch) ||
              c.email.toLowerCase().includes(lowerSearch) ||
              c.phone.includes(lowerSearch)
          )
        : masterList;

      const processed = sortData(filtered, sortConfig);

      postMessage({
        type: "PROCESS_COMPLETE",
        payload: {
          data: processed,
          totalCount: processed.length,
        },
      });
      break;
    }

    // Unknown messages
    default:
      console.warn(`Worker: Unknown message type "${type}"`);
  }
};
