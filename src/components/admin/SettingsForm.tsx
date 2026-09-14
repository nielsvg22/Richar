"use client";

import { useState } from "react";

type SettingsValues = {
  resendApiKey: string;
  resendApiKeyConfigured: boolean;
  emailFrom: string;
  emailReplyTo: string;
};

export default function SettingsForm({ initial }: { initial: SettingsValues }) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [maskedKey, setMaskedKey] = useState(initial.resendApiKey);
  const [configured, setConfigured] = useState(initial.resendApiKeyConfigured);
  const [emailFrom, setEmailFrom] = useState(initial.emailFrom);
  const [emailReplyTo, setEmailReplyTo] = useState(initial.emailReplyTo);

  const [saveStatus, setSaveStatus] = useState<"idle" | "loading" | "error">("idle");
  const [saveMessage, setSaveMessage] = useState("");

  const [testEmail, setTestEmail] = useState("");
  const [testStatus, setTestStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [testMessage, setTestMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("loading");
    setSaveMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resendApiKey: apiKeyInput || undefined,
          emailFrom,
          emailReplyTo,
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Opslaan mislukt.");

      setMaskedKey(body.resendApiKey);
      setConfigured(body.resendApiKeyConfigured);
      setApiKeyInput("");
      setSaveStatus("idle");
      setSaveMessage("Instellingen opgeslagen.");
    } catch (err) {
      setSaveStatus("error");
      setSaveMessage(err instanceof Error ? err.message : "Opslaan mislukt.");
    }
  }

  async function handleTest(e: React.FormEvent) {
    e.preventDefault();
    setTestStatus("loading");
    setTestMessage("");

    try {
      const res = await fetch("/api/settings/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Versturen mislukt.");
      setTestStatus("success");
      setTestMessage(`Testmail verstuurd naar ${testEmail}!`);
    } catch (err) {
      setTestStatus("error");
      setTestMessage(err instanceof Error ? err.message : "Versturen mislukt.");
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="rounded-[2.5rem] bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-xl font-bold">Resend e-mail</h2>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              configured ? "bg-mint-soft text-ink" : "bg-coral-soft text-ink"
            }`}
          >
            {configured ? "✓ Geconfigureerd" : "Niet geconfigureerd"}
          </span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          Nodig om automatische bevestigings-, herinnerings- en reviewmails te versturen via{" "}
          <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline">
            Resend
          </a>
          .
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-semibold">Resend API key</label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={maskedKey || "re_xxxxxxxxxxxxxxxxxxxx"}
              className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              autoComplete="off"
            />
            <p className="mt-2 text-xs text-ink-soft">
              {maskedKey
                ? `Huidige key: ${maskedKey}. Laat leeg om de huidige key te behouden.`
                : "Vind je API key in het Resend dashboard onder API Keys."}
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Afzender (from)</label>
              <input
                type="text"
                value={emailFrom}
                onChange={(e) => setEmailFrom(e.target.value)}
                placeholder="Rosa & Charlotte <onboarding@resend.dev>"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
              <p className="mt-2 text-xs text-ink-soft">
                Zonder geverifieerd domein bij Resend werkt alleen{" "}
                <code className="rounded bg-cream-soft px-1">onboarding@resend.dev</code>.
              </p>
            </div>
            <div>
              <label className="text-sm font-semibold">Reply-to e-mailadres</label>
              <input
                type="email"
                value={emailReplyTo}
                onChange={(e) => setEmailReplyTo(e.target.value)}
                placeholder="hallo@rosaencharlotte.nl"
                className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
              />
            </div>
          </div>
        </div>

        {saveMessage && (
          <p
            className={`mt-5 rounded-xl px-4 py-3 text-sm ${
              saveStatus === "error" ? "bg-coral-soft" : "bg-mint-soft"
            }`}
          >
            {saveMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={saveStatus === "loading"}
          className="mt-6 rounded-full bg-ink px-7 py-3.5 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
        >
          {saveStatus === "loading" ? "Opslaan..." : "Instellingen opslaan"}
        </button>
      </form>

      <form onSubmit={handleTest} className="rounded-[2.5rem] bg-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-bold">Testmail versturen</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Controleer of de instellingen werken door een testmail te versturen.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            placeholder="jouw@email.nl"
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
          />
          <button
            type="submit"
            disabled={testStatus === "loading"}
            className="whitespace-nowrap rounded-full bg-coral px-6 py-3 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
          >
            {testStatus === "loading" ? "Versturen..." : "Testmail versturen"}
          </button>
        </div>

        {testMessage && (
          <p
            className={`mt-4 rounded-xl px-4 py-3 text-sm ${
              testStatus === "error" ? "bg-coral-soft" : "bg-mint-soft"
            }`}
          >
            {testMessage}
          </p>
        )}
      </form>
    </div>
  );
}
