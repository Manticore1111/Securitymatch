import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import { prisma } from "@/lib/prisma";
import { MessagesPanel } from "./messages-panel";

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const conversations = await prisma.conversation.findMany({ where: { members: { some: { userId: session.user.id } } }, include: { job: { select: { id: true, title: true } }, members: { include: { user: { select: { id: true, firstName: true, lastName: true } } } }, messages: { orderBy: { createdAt: "asc" }, select: { id: true, body: true, senderId: true, readAt: true, createdAt: true } } }, orderBy: { updatedAt: "desc" } });
  return <MessagesPanel currentUserId={session.user.id} initialConversations={conversations.map((item) => ({ ...item, messages: item.messages.map((message) => ({ ...message, createdAt: message.createdAt.toISOString(), readAt: message.readAt?.toISOString() ?? null })) }))} />;
}