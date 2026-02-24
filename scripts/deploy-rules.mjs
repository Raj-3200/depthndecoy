/**
 * Deploy Firestore security rules using the REST API + service account.
 * Run: node scripts/deploy-rules.mjs
 */

import { readFileSync } from "fs";
import { initializeApp, cert } from "firebase-admin/app";
import { GoogleAuth } from "google-auth-library";

const serviceAccount = JSON.parse(
  readFileSync(new URL("./serviceAccountKey.json", import.meta.url), "utf8")
);

const projectId = serviceAccount.project_id;

const rulesSource = readFileSync(
  new URL("../firestore.rules", import.meta.url),
  "utf8"
);

const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/firebase",
    "https://www.googleapis.com/auth/firebase.readonly",
  ],
});

const client = await auth.getClient();

// Step 1: Create a new ruleset
const rulesetRes = await client.request({
  url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/rulesets`,
  method: "POST",
  data: {
    source: {
      files: [
        {
          name: "firestore.rules",
          content: rulesSource,
        },
      ],
    },
  },
});

const rulesetName = rulesetRes.data.name;
console.log("✓ Created ruleset:", rulesetName);

// Step 2: Create/update the release to point to this ruleset
try {
  await client.request({
    url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases`,
    method: "POST",
    data: {
      name: `projects/${projectId}/releases/cloud.firestore`,
      rulesetName: rulesetName,
    },
  });
  console.log("✓ Release created — rules are now LIVE!");
} catch (err) {
  // If release already exists, update it
  if (err.status === 409 || err.code === 409) {
    await client.request({
      url: `https://firebaserules.googleapis.com/v1/projects/${projectId}/releases/cloud.firestore`,
      method: "PATCH",
      data: {
        release: {
          name: `projects/${projectId}/releases/cloud.firestore`,
          rulesetName: rulesetName,
        },
      },
    });
    console.log("✓ Release updated — rules are now LIVE!");
  } else {
    throw err;
  }
}

console.log("\n✅ Firestore security rules deployed successfully!");
console.log("   Products & categories are now publicly readable.");
process.exit(0);
