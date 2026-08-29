import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";

const MAX_FILE_SIZE = 10_000_000;
const allowedTypes = new Set(["IDENTITY", "SECURITY_PASS", "CERTIFICATE", "CONTRACT", "INVOICE", "OTHER"]);
const allowedMimeTypes = new Set([
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	"image/jpeg",
	"image/png",
	"image/webp",
]);

export async function POST(request: Request) {
	const session = await auth();

	if (!session?.user || session.user.role !== "SECURITY_PROFESSIONAL") {
		return NextResponse.json({ error: "Alleen beveiligers kunnen documenten uploaden." }, { status: 403 });
	}

	if (!process.env.BLOB_READ_WRITE_TOKEN) {
		return NextResponse.json({ error: "Documentopslag is nog niet geconfigureerd." }, { status: 503 });
	}

	const form = await request.formData();
	const file = form.get("file");
	const type = String(form.get("type") ?? "OTHER");

	if (!(file instanceof File) || file.size === 0 || file.size > MAX_FILE_SIZE) {
		return NextResponse.json({ error: "Bestand ontbreekt, is leeg of is groter dan 10 MB." }, { status: 400 });
	}

	if (!allowedTypes.has(type) || !allowedMimeTypes.has(file.type)) {
		return NextResponse.json({ error: "Bestandstype of documentcategorie is niet toegestaan." }, { status: 400 });
	}

	const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
	const storageKey = `documents/${session.user.id}/${randomUUID()}-${safeFileName}`;

	try {
		await put(storageKey, file, {
			access: "private",
			addRandomSuffix: false,
			contentType: file.type,
		});

		const document = await prisma.document.create({
			data: {
				userId: session.user.id,
				type: type as "IDENTITY" | "SECURITY_PASS" | "CERTIFICATE" | "CONTRACT" | "INVOICE" | "OTHER",
				fileName: file.name,
				storageKey,
			},
		});

		return NextResponse.json({ id: document.id, status: document.status }, { status: 201 });
	} catch {
		return NextResponse.json({ error: "Het document kon niet worden opgeslagen." }, { status: 500 });
	}
}