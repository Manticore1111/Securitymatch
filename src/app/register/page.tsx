import { RegisterForm } from "@/components/auth-forms";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";

export default async function RegisterPage() {
	const session = await auth();
	if (session?.user) redirect("/dashboard");
	return <RegisterForm />;
}
