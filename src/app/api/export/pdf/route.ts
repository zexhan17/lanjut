import { NextResponse } from "next/server";
import { exportResumeServer } from "@/lib/server/export-resume-server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resume, template, fileName } = body;

    if (!resume || typeof resume !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload: 'resume' object is required." },
        { status: 400 },
      );
    }

    const result = await exportResumeServer(resume, {
      template,
      format: "pdf",
      fileName,
    });

    const bodyData =
      typeof result.data === "string" ? result.data : Buffer.from(result.data);

    return new NextResponse(bodyData, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Content-Disposition": `attachment; filename="${result.fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 422 },
    );
  }
}
