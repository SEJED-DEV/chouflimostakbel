"use client";

import LegalDocument from "./LegalDocument";
import { useSlice } from "@/components/i18n/slice";
import { legal } from "@/components/i18n/legal";

export default function PrivacyContent() {
  const t = useSlice(legal);
  return <LegalDocument doc={t.privacy} />;
}
