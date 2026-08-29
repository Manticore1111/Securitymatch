import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Geen toegang." }, { status: 403 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Documentopslag is nog niet geconfigureerd." }, { status: 503 });
  }

  const { id } = await context.params;
  const document = await prisma.document.findUnique({ where: { id } });

  if (!document || (session.user.role !== "ADMIN" && document.userId !== session.user.id)) {
    return NextResponse.json({ error: "Document niet gevonden." }, { status: 404 });
  }

  try {
    const blob = await get(document.storageKey, { access: "private" });

    if (!blob || blob.statusCode !== 200) {
      return NextResponse.json({ error: "Document niet gevonden." }, { status: 404 });
    }

    const safeFileName = document.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
    return new Response(blob.stream, {
      headers: {
        "Content-Type": blob.blob.contentType,
        "Content-Disposition": `attachment; filename="${safeFileName}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Het document kon niet worden geladen." }, { status: 500 });
  }
}