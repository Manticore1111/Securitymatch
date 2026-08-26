import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) { const session = await auth(); if (!session?.user || session.user.role !== "SECURITY_PROFESSIONAL") return NextResponse.json({ error: "Alleen beveiligers kunnen documenten uploaden." }, { status: 403 }); const form = await request.formData(); const file = form.get("file"); const type = String(form.get("type") ?? "OTHER"); if (!(file instanceof File) || file.size > 10_000_000) return NextResponse.json({ error: "Bestand ontbreekt of is te groot." }, { status: 400 }); const storageKey = `${session.user.id}/${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`; const target = path.join(process.cwd(), "private-storage", storageKey); await mkdir(path.dirname(target), { recursive: true }); await writeFile(target, Buffer.from(await file.arrayBuffer())); const document = await prisma.document.create({ data: { userId: session.user.id, type: type as "IDENTITY" | "SECURITY_PASS" | "CERTIFICATE" | "CONTRACT" | "INVOICE" | "OTHER", fileName: file.name, storageKey } }); return NextResponse.json({ id: document.id, status: document.status }, { status: 201 }); }