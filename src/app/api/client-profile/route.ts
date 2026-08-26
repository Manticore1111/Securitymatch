import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { prisma } from "@/lib/prisma";
import { clientProfileSchema } from "@/lib/client-validation";

async function getClient() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Je moet ingelogd zijn." }, { status: 401 }) };
  if (session.user.role !== "CLIENT") return { error: NextResponse.json({ error: "Je hebt geen toegang tot dit profiel." }, { status: 403 }) };
  return { userId: session.user.id };
}

export async function GET() {
  const client = await getClient();
  if (client.error) return client.error;
  const profile = await prisma.clientProfile.findUnique({ where: { userId: client.userId }, include: { user: { select: { firstName: true, lastName: true, email: true, phone: true } } } });
  return NextResponse.json(profile);
}

export async function PUT(request: Request) {
  const client = await getClient();
  if (client.error) return client.error;
  const parsed = clientProfileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Ongeldige profielgegevens." }, { status: 400 });
  const data = parsed.data;
  const profile = await prisma.$transaction(async (transaction) => {
    await transaction.user.update({ where: { id: client.userId }, data: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone || null } });
    return transaction.clientProfile.upsert({ where: { userId: client.userId }, create: { userId: client.userId, organizationName: data.organizationName, kvkNumber: data.kvkNumber, website: data.website || null, description: data.description, address: data.address, city: data.city }, update: { organizationName: data.organizationName, kvkNumber: data.kvkNumber, website: data.website || null, description: data.description, address: data.address, city: data.city } });
  });
  return NextResponse.json(profile);
}
