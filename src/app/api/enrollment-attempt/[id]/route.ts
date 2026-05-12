import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
const VALID_STATUSES = ["STARTED", "COURSE_SELECTED", "PROPOSAL_GENERATED"] as const;
type ValidStatus = (typeof VALID_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let body: {
    status?: string;
    mainCourseId?: number;
    mainCourseTitle?: string;
    extraCourseIds?: number[];
    totalCourses?: number;
    proposalLink?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (body.status && !VALID_STATUSES.includes(body.status as ValidStatus)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  try {
    const updated = await prisma.enrollmentAttempt.update({
      where: { id },
      data: {
        ...(body.status ? { status: body.status as ValidStatus } : {}),
        ...(body.mainCourseId !== undefined
          ? { mainCourseId: body.mainCourseId }
          : {}),
        ...(body.mainCourseTitle !== undefined
          ? { mainCourseTitle: body.mainCourseTitle }
          : {}),
        ...(body.extraCourseIds !== undefined
          ? { extraCourseIds: body.extraCourseIds }
          : {}),
        ...(body.totalCourses !== undefined
          ? { totalCourses: body.totalCourses }
          : {}),
        ...(body.proposalLink !== undefined
          ? { proposalLink: body.proposalLink }
          : {}),
      },
    });

    return NextResponse.json({ id: updated.id, status: updated.status });
  } catch {
    return NextResponse.json(
      { error: "Tentativa não encontrada" },
      { status: 404 },
    );
  }
}
