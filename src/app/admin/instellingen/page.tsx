import type { Metadata } from "next";
import { getSettings, maskApiKey } from "@/lib/settings";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Instellingen",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function InstellingenPage() {
  const settings = getSettings();

  return (
    <div>
      <h1 className="font-heading text-3xl font-extrabold">Instellingen</h1>
      <p className="mt-2 text-ink-soft">
        Beheer hier de instellingen voor het versturen van automatische e-mails.
      </p>

      <div className="mt-8 max-w-2xl">
        <SettingsForm
          initial={{
            resendApiKey: maskApiKey(settings.resendApiKey),
            resendApiKeyConfigured: Boolean(settings.resendApiKey),
            emailFrom: settings.emailFrom,
            emailReplyTo: settings.emailReplyTo,
            mollieApiKey: maskApiKey(settings.mollieApiKey),
            mollieApiKeyConfigured: Boolean(settings.mollieApiKey),
          }}
        />
      </div>
    </div>
  );
}
