import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

export async function GET() {
  const localApkPath = path.resolve(
    process.cwd(),
    "../../apps/mobile/build/app/outputs/flutter-apk/app-debug.apk"
  );

  // If running locally and local APK is available on disk, stream directly
  if (fs.existsSync(localApkPath)) {
    const fileBuffer = fs.readFileSync(localApkPath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="sokoyield-v1.0.0-nakuru.apk"',
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  }

  // In production / Vercel deployment, redirect to GitHub release asset
  const githubReleaseUrl =
    "https://github.com/PWKAMAU/sokoyield/releases/download/v1.0.0/app-debug.apk";
  return NextResponse.redirect(githubReleaseUrl, 302);
}
