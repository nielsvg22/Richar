import { Resend } from "resend";
import type { Booking } from "./bookings";
import type { Voucher } from "./vouchers";
import { getExtra } from "./pricing";
import { getSettings } from "./settings";
import { getInvoiceForBooking } from "./invoices";

async function getClient() {
  const settings = await getSettings();
  const apiKey = settings.resendApiKey || process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

async function getFrom() {
  const settings = await getSettings();
  return settings.emailFrom || process.env.EMAIL_FROM || "Rosa & Charlotte <onboarding@resend.dev>";
}

async function getReplyTo() {
  const settings = await getSettings();
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

function siteUrl(origin?: string) {
  return origin || process.env.NEXT_PUBLIC_SITE_URL || "https://www.rosaencharlotte.nl";
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
  const client = await getClient();
  if (!client) {
    console.warn("[email] Geen Resend API key geconfigureerd, e-mail niet verstuurd:", subject, "→", to);
    return {
      success: false,
      error: "Geen Resend API key geconfigureerd. Stel deze in bij Admin → Instellingen.",
    };
  }
  try {
    const { error: sendError } = await client.emails.send({
      from: await getFrom(),
      to,
      subject,
      html,
      replyTo: await getReplyTo(),
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

export async function sendVoucherEmail(voucher: Voucher) {
  const html = wrapper(
    "Jullie cadeaubon is onderweg! 🎁",
    `
    <p>Hoi ${voucher.purchaserName.split(" ")[0]},</p>
    <p>Bedankt voor je aankoop! Hier is de cadeaubon${voucher.recipientName ? ` voor ${voucher.recipientName}` : ""}.</p>
    <div style="margin:24px 0;padding:24px;border-radius:20px;background:#F6B6C8;text-align:center;">
      <p style="margin:0;font-size:13px;color:#292522;">Cadeaubon t.w.v.</p>
      <p style="margin:4px 0;font-size:32px;font-weight:bold;color:#292522;">€${voucher.amount}</p>
      <p style="margin:8px 0 0;font-size:20px;font-weight:bold;letter-spacing:2px;color:#292522;">${voucher.code}</p>
    </div>
    ${voucher.message ? `<p style="font-style:italic;">"${voucher.message}"</p>` : ""}
    <p>Deze code kan tijdens het boeken van een kinderfeestje worden ingevuld bij "Cadeaubon" en wordt dan automatisch van de prijs afgetrokken.</p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(voucher.purchaserEmail, "Jullie cadeaubon is onderweg! 🎁", html);
}

export async function sendInternalBookingNotification(booking: Booking, origin?: string) {
  const settings = await getSettings();
  const to = settings.emailReplyTo || "hallo@rosaencharlotte.nl";

  const html = wrapper(
    "🎉 Nieuwe boeking binnengekomen",
    `
    <p>Er is zojuist een nieuwe boeking binnengekomen.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Boekingsnummer</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${booking.id}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Thema</td><td style="padding:6px 0;text-align:right;">${booking.themeName}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Datum</td><td style="padding:6px 0;text-align:right;">${formatDate(booking.date)}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Ouder</td><td style="padding:6px 0;text-align:right;">${booking.parentName}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Totaal</td><td style="padding:6px 0;text-align:right;font-weight:bold;color:#F28F79;">€${booking.totalPrice}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/admin/boekingen/${booking.id}" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk in admin</a>
    </p>
    `
  );

  return send(to, `Nieuwe boeking: ${booking.themeName} (${booking.id})`, html);
}

export async function sendBookingConfirmation(booking: Booking, origin?: string) {
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
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/draaiboek/${booking.id}" style="display:inline-block;background:#F28F79;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk het draaiboek van jullie feestje</a>
    </p>
    <p style="margin-top:12px;">
      <a href="${siteUrl(origin)}/account/registreren?email=${encodeURIComponent(booking.email)}" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Maak een account aan om je boeking te volgen</a>
    </p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Bedankt voor je boeking, ${booking.parentName.split(" ")[0]}!`, html);
}

export async function sendPartyReminder(booking: Booking, origin?: string) {
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
    <p style="margin-top:16px;">
      <a href="${siteUrl(origin)}/draaiboek/${booking.id}" style="display:inline-block;background:#F28F79;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk het volledige draaiboek</a>
    </p>
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

export async function sendDateAlmostFullNotification(date: string, count: number, max: number, origin?: string) {
  const settings = await getSettings();
  const to = settings.emailReplyTo || "hallo@rosaencharlotte.nl";

  const html = wrapper(
    "📅 Datum volgeboekt",
    `
    <p><strong>${formatDate(date)}</strong> heeft nu ${count} van de ${max} boekingen en zit vol.</p>
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/admin/agenda" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk de agenda</a>
    </p>
    `
  );

  return send(to, `Datum volgeboekt: ${formatDate(date)}`, html);
}

export async function sendInvoiceEmail(booking: Booking, origin?: string) {
  const invoice = await getInvoiceForBooking(booking.id);
  const remaining = booking.depositPaid ? booking.totalPrice - booking.depositAmount : booking.totalPrice;

  const html = wrapper(
    "Jullie factuur 🧾",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>Hierbij de factuur voor het <strong>${booking.themeName}</strong> van ${booking.childName}.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Factuurnummer</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${invoice?.number ?? ""}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Datum feestje</td><td style="padding:6px 0;text-align:right;">${formatDate(booking.date)}</td></tr>
      <tr><td style="padding:10px 0 0;font-weight:bold;">Totaalbedrag</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;color:#F28F79;">€${booking.totalPrice}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">Nog te betalen</td><td style="padding:6px 0;text-align:right;">€${Math.max(0, remaining)}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/factuur/${booking.id}" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk en download de factuur</a>
    </p>
    <p>Heb je een vraag over de factuur? Antwoord gewoon op deze e-mail.</p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Factuur ${invoice?.number ?? ""} — Rosa & Charlotte`, html);
}

export async function sendPaymentReminder(booking: Booking, origin?: string) {
  const remaining = booking.depositPaid ? booking.totalPrice - booking.depositAmount : booking.totalPrice;

  const html = wrapper(
    "Vriendelijke betaalherinnering 💌",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>Even een vriendelijke herinnering: voor het ${booking.themeName} van ${booking.childName} staat nog een bedrag open.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Datum feestje</td><td style="padding:6px 0;text-align:right;">${formatDate(booking.date)}</td></tr>
      <tr><td style="padding:10px 0 0;font-weight:bold;">Nog te betalen</td><td style="padding:10px 0 0;text-align:right;font-weight:bold;color:#F28F79;">€${Math.max(0, remaining)}</td></tr>
    </table>
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/factuur/${booking.id}" style="display:inline-block;background:#F28F79;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk de factuur</a>
    </p>
    <p>Heb je hem al betaald? Dan mag je deze mail natuurlijk negeren. Vragen? Antwoord gerust op deze e-mail.</p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, `Betaalherinnering — ${booking.themeName}`, html);
}

export async function sendLoyaltyRewardEmail(
  booking: Booking,
  discountCode: string,
  discountPercent: number
) {
  const html = wrapper(
    "Bedankt dat je terugkomt! 💛",
    `
    <p>Hoi ${booking.parentName.split(" ")[0]},</p>
    <p>Wat leuk dat jullie steeds weer voor Rosa &amp; Charlotte kiezen! Als bedankje krijgen jullie een persoonlijke kortingscode voor het volgende feestje.</p>
    <div style="margin:24px 0;padding:24px;border-radius:20px;background:#BFE4D0;text-align:center;">
      <p style="margin:0;font-size:13px;color:#292522;">Jullie trouwe-klant-korting</p>
      <p style="margin:4px 0;font-size:32px;font-weight:bold;color:#292522;">${discountPercent}%</p>
      <p style="margin:8px 0 0;font-size:20px;font-weight:bold;letter-spacing:2px;color:#292522;">${discountCode}</p>
    </div>
    <p>Vul deze code in bij het boeken van jullie volgende feestje.</p>
    <p style="margin-top:20px;">
      <a href="${siteUrl()}/boeken" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Boek het volgende feestje</a>
    </p>
    <p>Liefs,<br/>Rosa &amp; Charlotte</p>
    `
  );

  return send(booking.email, "Bedankt! Hier is jullie trouwe-klant-korting 💛", html);
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

export async function sendInternalContactNotification(request: {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}, origin?: string) {
  const settings = await getSettings();
  const to = settings.emailReplyTo || "hallo@rosaencharlotte.nl";

  const html = wrapper(
    "📬 Nieuw bericht binnengekomen",
    `
    <p>Er staat een nieuw bericht klaar in de admin.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
      <tr><td style="padding:6px 0;color:#6b6259;">Naam</td><td style="padding:6px 0;text-align:right;font-weight:bold;">${request.name}</td></tr>
      <tr><td style="padding:6px 0;color:#6b6259;">E-mail</td><td style="padding:6px 0;text-align:right;">${request.email}</td></tr>
      ${request.phone ? `<tr><td style="padding:6px 0;color:#6b6259;">Telefoon</td><td style="padding:6px 0;text-align:right;">${request.phone}</td></tr>` : ""}
    </table>
    <p style="white-space:pre-wrap;background:#FFF4E6;border-radius:16px;padding:16px;">${request.message}</p>
    <p style="margin-top:20px;">
      <a href="${siteUrl(origin)}/admin/berichten" style="display:inline-block;background:#292522;color:#ffffff;padding:12px 24px;border-radius:999px;text-decoration:none;font-weight:bold;">Bekijk in admin</a>
    </p>
    `
  );

  return send(to, `Nieuw bericht van ${request.name}`, html);
}
