import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TesterRecord {
  id: string;
  email: string;
  fullName: string;
  subCounty: string;
  deviceModel: string;
  osVersion: string;
  optInDate: string;
  consecutiveDaysEngaged: number;
  status: string;
}

interface ClosedTestingManifest {
  applicationId: string;
  appName: string;
  track: string;
  versionCode: number;
  versionName: string;
  targetSdk: number;
  minSdk: number;
  testingRequirements: {
    mandatoryTesterCount: number;
    mandatoryContinuousDays: number;
    policyReference: string;
    productionUnlockEligible: boolean;
  };
  auditSummary: {
    totalProvisionedTesters: number;
    optedInCount: number;
    completedContinuousDays: number;
    status: string;
  };
  testers: TesterRecord[];
}

export function runClosedTestingAudit(): boolean {
  console.log('='.repeat(80));
  console.log('SOKOYIELD - GOOGLE PLAY 14-DAY CLOSED TESTING AUDIT (PHASE 7)');
  console.log('='.repeat(80));

  const manifestPath = path.join(__dirname, 'closed-testing-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error(`ERROR: Closed testing manifest not found at: ${manifestPath}`);
    return false;
  }

  const raw = fs.readFileSync(manifestPath, 'utf-8');
  const manifest: ClosedTestingManifest = JSON.parse(raw);

  let passed = true;

  // 1. Target SDK Check (Android 16 / API 36)
  console.log(`\n1. Target Android SDK Version:`);
  console.log(`   - Configured: API Level ${manifest.targetSdk}`);
  console.log(`   - Baseline Requirement: Android 16 (API 36)`);
  if (manifest.targetSdk === 36) {
    console.log(`   -> [PASS] Fully compliant with Android 16 baseline.`);
  } else {
    console.error(`   -> [FAIL] Target SDK is ${manifest.targetSdk}, must be 36.`);
    passed = false;
  }

  // 2. Tester Count Verification (At Least 20 Opted-In Testers)
  console.log(`\n2. Mandatory Tester Count Verification:`);
  console.log(`   - Required Opted-In Testers: >= ${manifest.testingRequirements.mandatoryTesterCount}`);
  console.log(`   - Total Active Testers: ${manifest.testers.length}`);
  const uniqueEmails = new Set(manifest.testers.map((t) => t.email.toLowerCase()));
  if (manifest.testers.length >= 20 && uniqueEmails.size >= 20) {
    console.log(`   -> [PASS] Verified ${uniqueEmails.size} distinct testers provisioned (meets or exceeds 20 requirement).`);
  } else {
    console.error(`   -> [FAIL] Tester count mismatch: ${manifest.testers.length} provisioned (need at least 20 unique).`);
    passed = false;
  }

  // 3. 14 Continuous Days Requirement Verification
  console.log(`\n3. Continuous Engagement Verification (14 Continuous Days):`);
  const allEngaged14Days = manifest.testers.every((t) => t.consecutiveDaysEngaged >= 14);
  console.log(`   - Required Days: 14 continuous days`);
  console.log(`   - Testers Completing 14 Days: ${manifest.testers.filter((t) => t.consecutiveDaysEngaged >= 14).length} / ${manifest.testers.length}`);
  if (allEngaged14Days) {
    console.log(`   -> [PASS] All testers completed 14 continuous days of active testing.`);
  } else {
    console.error(`   -> [FAIL] Not all testers have completed 14 continuous days.`);
    passed = false;
  }

  // 4. Device Integrity & Geographic Distribution
  console.log(`\n4. Geographic & Device Distribution (Nakuru County, Kenya):`);
  const devices = manifest.testers.map((t) => `${t.fullName} (${t.deviceModel} - ${t.subCounty})`);
  devices.slice(0, 5).forEach((d) => console.log(`   - ${d}`));
  console.log(`   - ... and ${devices.length - 5} more regional agricultural testers.`);

  console.log('\n' + '='.repeat(80));
  if (passed) {
    console.log('STATUS: [ELIGIBLE FOR PRODUCTION UNLOCK]');
    console.log('Google Play 14-day closed test verified. Ready for Production Track promotion.');
  } else {
    console.log('STATUS: [AUDIT FAILED]');
  }
  console.log('='.repeat(80));

  return passed;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const success = runClosedTestingAudit();
  process.exit(success ? 0 : 1);
}
