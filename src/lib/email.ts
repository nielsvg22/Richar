import { Resend } from "resend";
import type { Booking } from "./bookings";
import { getExtra } from "./pricing";
import { getSettings } from "./settings";

function getClient() {
  const settings = getSettings();
  const apiKey = settings.resendApiKey || process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFrom() {
  const settings = getSettings();
  return settings.emailFrom || process.env.EMAIL_FROM || "Rosa & Charlotte <onboarding@resend.dev>";
}

function getReplyTo() {
  const settings = getSettings();
  return settings.emailReplyTo || process.env.EMAIL_REPLY_TO || "hallo@rosaencharlotte.nl";
}

function wrapper(title: string, body: string) {
  return `
  <div style="background:#FFF9F1;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#292522;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;">
      <div style="background:#292522;padding:24px 32px;">
        <span style="font-size:20px;font-weight:bold;color:#FFF9F1;">🎉 Rosa &amp; Charlotte</span>
      </div>
      <div style="padding:32px;">
        <h1 style="font-size:22px;margin:0 0 16px;">${title}</h1>
        ${body}
      </div>
      <div style="background:#FFF4E6;padding:20px 32px;font-size:12px;color:#6b6259;">
        Rosa &amp; Charlotte Kinderfeestjes · hallo@rosaencharlotte.nl · 06 - 123 456 78
      </div>
    </div>
  </div>`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function send(to: string, subject: string, html: string) {
  const client = getClient();
  if (!client) {
    console.warn("[email] Geen Resend API key geconfigureerd, e-mail niet verstuurd:", subject, "→", to);
    return {
      success: false,
      error: "Geen Resend API key geconfigureerd. Stel deze in bij Admin → Instellingen.",
    };
  }
  try {
    const { error: sendError } = await client.emails.send({
      from: getFrom(),
      to,
      subject,
      html,
      replyTo: getReplyTo(),
    });
    if (sendError) {
      console.error("[email] Resend gaf een fout terug:", sendError);
      return { success: false, error: sendError.message || "Resend gaf een fout terug." };
    }
    return { success: true };
  } catch (err) {
    console.error("[email] Versturen mislukt:", err);
    return { success: false, error: err instanceof Error ? err.message : "Onbekende fout." };
  }
}

export async function sendTestEmail(to: string) {
  const html = wrapper(
    "Testmail vanuit Rosa & Charlotte 🎉",
    `
    <p>Dit is een testbericht om te controleren of de Resend-instellingen correct zijn ingesteld.</p>
    <p>Als je dit ontvangt, werkt alles zoals het hoort!</p>
    `
  );
  return send(to, "Testmail — Resend instellingen werken!", html);
}

export async function sendBookingConfirmation(booking: Booking) {
  const extrasList = booking.extras
    .map((id) => getExtra(id)?.name)
    .filter(Boolean)
    .join(", ");

  const html = wrapper(
    "Bedankt voor je boeking! 🎉",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>Wat leuk! We hebben de boekingsaanvraag voor het <strong>${booking.themeName}</strong> van ${booking.childName} ontvangen. We nemen zo snel mogelijk contact met je op om alles te bevestigen.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Boekingsnummer</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${booking.id}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Datum</td><td style="padding:6px 0;text-align:right;">${formatDate(booking.date)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Tijd</td><td style="padding:6px 0;text-align:right;">${booking.time}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Pakket</td><td style="padding:6px 0;text-align:right;">${booking.packageName} (${booking.kids} kinderen)</td></tr>
      ${extrasList ? `<tr><td style="padding:6px 0;color:#6b6259;">Extra's</td><td style="padding:6px 0;text-align:right;">${extrasList}</td></tr>` : ""}
      <tr><td style="padding:10px 0 0;font-weight:bold;">Totaal</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;color:#F28F79;">€${booking.totalPrice}</td></tr>
    </table>
    <p>Heb je in de tussentijd een vraag? Antwoord gewoon op deze e-mail.</p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Bedankt voor je boeking, ${booking.parentName.split(" ")[0]}!`, html);
}

export async function sendPartyReminder(booking: Booking) {
  const html = wrapper(
    "Bijna feest! 🎉",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>Nog even en dan is het zover: het ${booking.themeName} van ${booking.childName}!</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Datum</td><td style="padding:6px 0;text-align:right;">${formatDate(booking.date)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Tijd</td><td style="padding:6px 0;text-align:right;">${booking.time}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Locatie</td><td style="padding:6px 0;text-align:right;">${booking.location || "Bij jullie thuis"}</td></tr>
    </table>
    <p style="font-weight:bold;margin-bottom:8px;">Checklist voor jullie:</p>
    <ul style="padding-left:18px;color:#292522;">
      <li>Zorg dat er een tafel/ruimte vrij is voor de activiteit</li>
      <li>Geef eventuele allergieën nogmaals aan ons door</li>
      <li>Wij zorgen voor de rest, jullie hoeven alleen te genieten!</li>
    </ul>
    <p>Vragen? Bel of mail ons gerust.</p>
    <p>Tot snel!<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Bijna feest! Over een paar dagen is het zover 🎉`, html);
}

export async function sendReviewRequest(booking: Booking) {
  const html = wrapper(
    "Hoe vonden jullie het? 💌",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>We hopen dat het ${booking.themeName} van ${booking.childName} een groot feest was! We zijn benieuwd hoe jullie het vonden.</p>
    <p>Zou je een paar minuten willen nemen om een review achter te laten? Dat betekent ontzettend veel voor ons als klein bedrijf.</p>
    <p style="margin-top:24px;">
      <a href="mailto:hallo@rosaencharlotte.nl?subject=Review%20${encodeURIComponent(booking.themeName)}" style="display:inline-block;background:#F28F79;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Laat een review achter</a>
    </p>
    <p>Dankjewel namens ons hele team!</p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Hoe vonden jullie het feestje van ${booking.childName}?`, html);
}

export async function sendContactAutoReply(name: string, email: string) {
  const html = wrapper(
    "We hebben je bericht ontvangen! 👋",
    `
    <p>Hoi ${name.split(" ")[0]},</p>
    <p>Bedankt voor je bericht. We nemen binnen 1 werkdag contact met je op.</p>
    <p>Tot snel!<br/>Rosa &amp; Charlotte</p>
    `
  );
  return send(email, "We hebben je bericht ontvangen", html);
}
