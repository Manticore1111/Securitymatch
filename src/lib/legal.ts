const requiredLegalValues = [
  "NEXT_PUBLIC_LEGAL_ENTITY_NAME",
  "NEXT_PUBLIC_LEGAL_ADDRESS",
  "NEXT_PUBLIC_LEGAL_POSTAL_CODE",
  "NEXT_PUBLIC_LEGAL_CITY",
  "NEXT_PUBLIC_LEGAL_KVK_NUMBER",
  "NEXT_PUBLIC_LEGAL_EMAIL",
] as const;

function value(name: string, fallback = "Nog in te vullen") {
  return process.env[name]?.trim() || fallback;
}

export const legalDetails = {
  brandName: value("NEXT_PUBLIC_LEGAL_BRAND_NAME", "SecurityMatch"),
  entityName: value("NEXT_PUBLIC_LEGAL_ENTITY_NAME"),
  address: value("NEXT_PUBLIC_LEGAL_ADDRESS"),
  postalCode: value("NEXT_PUBLIC_LEGAL_POSTAL_CODE"),
  city: value("NEXT_PUBLIC_LEGAL_CITY"),
  chamberOfCommerceNumber: value("NEXT_PUBLIC_LEGAL_KVK_NUMBER"),
  vatNumber: value("NEXT_PUBLIC_LEGAL_VAT_NUMBER", "Alleen indien van toepassing"),
  email: value("NEXT_PUBLIC_LEGAL_EMAIL"),
  phone: value("NEXT_PUBLIC_LEGAL_PHONE", "Alleen indien van toepassing"),
  privacyEmail: value("NEXT_PUBLIC_LEGAL_PRIVACY_EMAIL", value("NEXT_PUBLIC_LEGAL_EMAIL")),
};

export const legalDetailsAreComplete = requiredLegalValues.every((name) => Boolean(process.env[name]?.trim()));

export const legalLastUpdated = "26 augustus 2026";
export const legalTermsVersion = "2026-08-26";
