type EmailMessage = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "SecurityMatch <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY ontbreekt in .env.local.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, ...message }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`E-mail kon niet worden verzonden: ${details}`);
  }
}
