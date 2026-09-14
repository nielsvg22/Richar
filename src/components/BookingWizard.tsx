"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Theme } from "@/lib/themes";
import { packages, extras, getPackage, calculatePrice } from "@/lib/pricing";
import BookingSummary, { type AppliedDiscount, type AppliedVoucher } from "./BookingSummary";
import DatePicker from "./DatePicker";

const STEPS = [
  { id: 1, label: "Thema" },
  { id: 2, label: "Pakket" },
  { id: 3, label: "Datum" },
  { id: 4, label: "Extra's" },
  { id: 5, label: "Gegevens" },
  { id: 6, label: "Bevestigen" },
];

const TIME_SLOTS = ["10:00 - 12:00", "11:00 - 13:30", "13:00 - 15:30", "14:00 - 16:30", "15:00 - 17:30"];

type FormState = {
  themeSlug: string;
  packageId: string;
  kids: number;
  date: string;
  time: string;
  locationType: "thuis" | "locatie" | "anders";
  location: string;
  extras: string[];
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childAge: string;
  notes: string;
};

const initialState: FormState = {
  themeSlug: "",
  packageId: "",
  kids: 8,
  date: "",
  time: "",
  locationType: "thuis",
  location: "",
  extras: [],
  parentName: "",
  email: "",
  phone: "",
  childName: "",
  childAge: "",
  notes: "",
};

export default function BookingWizard({ themes }: { themes: Theme[] }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(() => {
    const thema = searchParams.get("thema");
    const pakket = searchParams.get("pakket");
    return {
      ...initialState,
      themeSlug: thema && themes.some((t) => t.slug === thema) ? thema : initialState.themeSlug,
      packageId: pakket && getPackage(pakket) ? pakket : initialState.packageId,
    };
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [confirmedId, setConfirmedId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<{ id: string; depositAmount: number } | null>(
    null
  );
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "loading" | "error">("idle");
  const [paymentError, setPaymentError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const theme = useMemo(
    () => themes.find((t) => t.slug === form.themeSlug),
    [themes, form.themeSlug]
  );
  const pkg = useMemo(() => getPackage(form.packageId), [form.packageId]);

  const [discountInput, setDiscountInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<AppliedDiscount | null>(null);
  const [discountStatus, setDiscountStatus] = useState<"idle" | "loading" | "error">("idle");
  const [discountError, setDiscountError] = useState("");

  const [voucherInput, setVoucherInput] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [voucherStatus, setVoucherStatus] = useState<"idle" | "loading" | "error">("idle");
  const [voucherError, setVoucherError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function toggleExtra(id: string) {
    setForm((f) => ({
      ...f,
      extras: f.extras.includes(id)
        ? f.extras.filter((e) => e !== id)
        : [...f.extras, id],
    }));
  }

  async function applyDiscountCode() {
    if (!pkg || !discountInput.trim()) return;
    setDiscountStatus("loading");
    setDiscountError("");
    const subtotal = calculatePrice(pkg, form.kids, form.extras).total;
    try {
      const res = await fetch("/api/discounts/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountInput.trim(), subtotal }),
      });
      const body = await res.json();
      if (!body.valid) {
        setDiscountStatus("error");
        setDiscountError(body.error ?? "Deze kortingscode is ongeldig.");
        setAppliedDiscount(null);
        return;
      }
      setAppliedDiscount({
        code: body.discount.code,
        amount: body.amount,
        description: body.discount.description,
      });
      setDiscountStatus("idle");
    } catch {
      setDiscountStatus("error");
      setDiscountError("Er ging iets mis bij het controleren van de code.");
    }
  }

  function removeDiscount() {
    setAppliedDiscount(null);
    setDiscountInput("");
    setDiscountError("");
    setDiscountStatus("idle");
  }

  async function applyVoucherCode() {
    if (!voucherInput.trim()) return;
    setVoucherStatus("loading");
    setVoucherError("");
    try {
      const res = await fetch("/api/vouchers/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherInput.trim() }),
      });
      const body = await res.json();
      if (!body.valid) {
        setVoucherStatus("error");
        setVoucherError(body.error ?? "Deze cadeaubon is ongeldig.");
        setAppliedVoucher(null);
        return;
      }
      setAppliedVoucher({ code: body.code, balance: body.balance });
      setVoucherStatus("idle");
    } catch {
      setVoucherStatus("error");
      setVoucherError("Er ging iets mis bij het controleren van de cadeaubon.");
    }
  }

  function removeVoucher() {
    setAppliedVoucher(null);
    setVoucherInput("");
    setVoucherError("");
    setVoucherStatus("idle");
  }

  function validateStep(current: number): boolean {
    const newErrors: Record<string, string> = {};
    if (current === 1 && !form.themeSlug) newErrors.themeSlug = "Kies een thema om verder te gaan.";
    if (current === 2 && !form.packageId) newErrors.packageId = "Kies een pakket om verder te gaan.";
    if (current === 3) {
      if (!form.date) newErrors.date = "Kies een datum voor het feestje.";
      if (!form.time) newErrors.time = "Kies een tijdslot.";
      if (form.locationType !== "thuis" && !form.location.trim())
        newErrors.location = "Vul de locatie in.";
    }
    if (current === 5) {
      if (!form.parentName.trim()) newErrors.parentName = "Vul je naam in.";
      if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Vul een geldig e-mailadres in.";
      if (!form.phone.trim()) newErrors.phone = "Vul je telefoonnummer in.";
      if (!form.childName.trim()) newErrors.childName = "Vul de naam van de jarige in.";
      if (!form.childAge || Number(form.childAge) < 1 || Number(form.childAge) > 14)
        newErrors.childAge = "Vul een geldige leeftijd in.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(6, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit() {
    if (!validateStep(3) || !validateStep(5) || !form.themeSlug || !form.packageId) {
      setSubmitError("Controleer of alle stappen volledig zijn ingevuld.");
      return;
    }
    setStatus("loading");
    setSubmitError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          discountCode: appliedDiscount?.code,
          voucherCode: appliedVoucher?.code,
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? "Er ging iets mis bij het boeken.");
      }
      const booking = await res.json();
      setConfirmedId(booking.id);
      setConfirmedBooking(booking);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setSubmitError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  async function startPayment() {
    if (!confirmedBooking) return;
    setPaymentStatus("loading");
    setPaymentError("");
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: confirmedBooking.id }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Er ging iets mis bij het starten van de betaling.");
      window.location.href = body.checkoutUrl;
    } catch (err) {
      setPaymentStatus("error");
      setPaymentError(err instanceof Error ? err.message : "Er ging iets mis.");
    }
  }

  if (status === "success" && confirmedId) {
    return (
      <div className="mx-auto max-w-xl rounded-[2.5rem] bg-white p-10 text-center shadow-sm">
        <p className="text-4xl">🎉</p>
        <h2 className="mt-4 font-heading text-2xl font-bold">
          Yes! Jullie boeking is aangevraagd
        </h2>
        <p className="mt-3 text-ink-soft">
          Boekingsnummer <span className="font-semibold text-ink">{confirmedId}</span>.
          We sturen binnen 1 werkdag een bevestiging naar {form.email}.
        </p>
        <div className="mt-6 rounded-2xl bg-mint-soft p-5 text-left text-sm">
          <p className="font-semibold">{theme?.name} · {pkg?.name} pakket</p>
          <p className="text-ink-soft">{form.date} · {form.time}</p>
        </div>

        {confirmedBooking && confirmedBooking.depositAmount > 0 && (
          <div className="mt-6 rounded-2xl border-2 border-coral-soft p-5 text-left">
            <p className="font-semibold">Aanbetaling direct regelen?</p>
            <p className="mt-1 text-sm text-ink-soft">
              Betaal nu de aanbetaling van €{confirmedBooking.depositAmount} online, dan is jullie
              plek definitief gereserveerd.
            </p>
            {paymentError && <p className="mt-3 text-sm text-coral">{paymentError}</p>}
            <button
              type="button"
              onClick={startPayment}
              disabled={paymentStatus === "loading"}
              className="mt-4 w-full rounded-full bg-coral px-6 py-3.5 text-sm font-semibold text-cream hover:opacity-90 disabled:opacity-60"
            >
              {paymentStatus === "loading" ? "Bezig..." : `Betaal €${confirmedBooking.depositAmount} aanbetaling`}
            </button>
            <p className="mt-3 text-center text-xs text-ink-soft">
              Liever later betalen? Geen probleem, we sturen ook een betaallink per e-mail.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-10 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold sm:gap-3 sm:text-sm">
        {STEPS.map((s, i) => (
          <li key={s.id} className="flex items-center gap-2 sm:gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step === s.id
                  ? "bg-coral text-cream"
                  : step > s.id
                    ? "bg-mint-soft text-ink"
                    : "bg-ink/5 text-ink-soft"
              }`}
            >
              {step > s.id ? "✓" : s.id}
            </span>
            <span className={step === s.id ? "text-ink" : "text-ink-soft"}>{s.label}</span>
            {i < STEPS.length - 1 && <span className="hidden text-ink/20 sm:inline">→</span>}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-[2.5rem] bg-white p-6 shadow-sm sm:p-8">
            {step === 1 && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Kies jullie thema</h2>
                <p className="mt-1 text-sm text-ink-soft">Wat vindt de jarige het leukst?</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {themes.map((t) => (
                    <button
                      key={t.slug}
                      type="button"
                      onClick={() => update("themeSlug", t.slug)}
                      className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-left transition-colors ${
                        form.themeSlug === t.slug
                          ? "border-coral bg-coral-soft/40"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <span>
                        <span className="block text-sm font-semibold">{t.name}</span>
                        <span className="block text-xs text-ink-soft">vanaf €{t.vanaf}</span>
                      </span>
                    </button>
                  ))}
                </div>
                {errors.themeSlug && <p className="mt-3 text-sm text-coral">{errors.themeSlug}</p>}
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Kies jullie pakket</h2>
                <p className="mt-1 text-sm text-ink-soft">En geef aan hoeveel kinderen er komen.</p>
                <div className="mt-6 grid gap-3">
                  {packages.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => update("packageId", p.id)}
                      className={`flex items-center justify-between rounded-2xl border-2 p-4 text-left transition-colors ${
                        form.packageId === p.id
                          ? "border-coral bg-coral-soft/40"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">{p.name}</span>
                        <span className="block text-xs text-ink-soft">
                          {p.duration} · max {p.maxKids} kinderen
                        </span>
                      </span>
                      <span className="font-heading text-lg font-bold">€{p.price}</span>
                    </button>
                  ))}
                </div>
                {errors.packageId && <p className="mt-3 text-sm text-coral">{errors.packageId}</p>}

                <div className="mt-6">
                  <label htmlFor="kids" className="text-sm font-semibold">
                    Aantal kinderen
                  </label>
                  <select
                    id="kids"
                    value={form.kids}
                    onChange={(e) => update("kids", Number(e.target.value))}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  >
                    {Array.from({ length: 14 }, (_, i) => i + 4).map((n) => (
                      <option key={n} value={n}>
                        {n} kinderen
                      </option>
                    ))}
                  </select>
                  {pkg && form.kids > pkg.maxKids && (
                    <p className="mt-2 text-xs text-ink-soft">
                      {form.kids - pkg.maxKids} kind(eren) boven het pakket, à €18 per kind extra.
                    </p>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Datum & locatie</h2>
                <p className="mt-1 text-sm text-ink-soft">Wanneer en waar vindt het feestje plaats?</p>

                <div className="mt-6">
                  <span className="text-sm font-semibold">Datum</span>
                  <p className="mb-2 text-xs text-ink-soft">
                    Volgeboekte dagen zijn doorgestreept, we kunnen daar helaas geen feestje meer plannen.
                  </p>
                  <DatePicker value={form.date} onChange={(date) => update("date", date)} />
                  {errors.date && <p className="mt-2 text-sm text-coral">{errors.date}</p>}
                </div>

                <div className="mt-5">
                  <label htmlFor="time" className="text-sm font-semibold">
                    Tijdslot
                  </label>
                  <select
                    id="time"
                    value={form.time}
                    onChange={(e) => update("time", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  >
                    <option value="">Kies een tijdslot</option>
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  {errors.time && <p className="mt-2 text-sm text-coral">{errors.time}</p>}
                </div>

                <div className="mt-6">
                  <span className="text-sm font-semibold">Locatie</span>
                  <div className="mt-2 grid gap-3 sm:grid-cols-3">
                    {(["thuis", "locatie", "anders"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => update("locationType", type)}
                        className={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                          form.locationType === type
                            ? "border-coral bg-coral-soft/40"
                            : "border-ink/10 hover:border-ink/30"
                        }`}
                      >
                        {type === "thuis" ? "Bij ons thuis" : type === "locatie" ? "Op locatie" : "Anders"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="location" className="text-sm font-semibold">
                    Adres of plaatsnaam
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={form.location}
                    onChange={(e) => update("location", e.target.value)}
                    placeholder="Bijv. Apeldoorn"
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  />
                  {errors.location && <p className="mt-2 text-sm text-coral">{errors.location}</p>}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Extra&apos;s</h2>
                <p className="mt-1 text-sm text-ink-soft">Maak het feestje nog completer (optioneel).</p>
                <div className="mt-6 space-y-3">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-2xl border-2 p-4 transition-colors ${
                        form.extras.includes(extra.id)
                          ? "border-coral bg-coral-soft/40"
                          : "border-ink/10 hover:border-ink/30"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={form.extras.includes(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                          className="h-5 w-5 accent-coral"
                        />
                        <span>
                          <span className="block text-sm font-semibold">{extra.name}</span>
                          <span className="block text-xs text-ink-soft">{extra.description}</span>
                        </span>
                      </span>
                      <span className="whitespace-nowrap text-sm font-semibold">
                        €{extra.price}
                        {extra.unit === "per kind" && <span className="text-xs text-ink-soft">/kind</span>}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-6">
                  <label htmlFor="discount" className="text-sm font-semibold">
                    Kortingscode
                  </label>
                  {appliedDiscount ? (
                    <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-mint bg-mint-soft/40 px-4 py-3 text-sm">
                      <span>
                        <span className="font-semibold">{appliedDiscount.code}</span> toegepast
                        {appliedDiscount.description ? ` — ${appliedDiscount.description}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={removeDiscount}
                        className="text-xs font-semibold text-ink-soft hover:text-coral"
                      >
                        Verwijderen
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <input
                        id="discount"
                        type="text"
                        value={discountInput}
                        onChange={(e) => setDiscountInput(e.target.value.toUpperCase())}
                        placeholder="Bijv. WELKOM10"
                        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyDiscountCode}
                        disabled={discountStatus === "loading" || !discountInput.trim()}
                        className="whitespace-nowrap rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
                      >
                        {discountStatus === "loading" ? "..." : "Toepassen"}
                      </button>
                    </div>
                  )}
                  {discountError && <p className="mt-2 text-sm text-coral">{discountError}</p>}
                </div>

                <div className="mt-6">
                  <label htmlFor="voucher" className="text-sm font-semibold">
                    Cadeaubon
                  </label>
                  {appliedVoucher ? (
                    <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-mint bg-mint-soft/40 px-4 py-3 text-sm">
                      <span>
                        <span className="font-semibold">{appliedVoucher.code}</span> toegepast —
                        tegoed €{appliedVoucher.balance}
                      </span>
                      <button
                        type="button"
                        onClick={removeVoucher}
                        className="text-xs font-semibold text-ink-soft hover:text-coral"
                      >
                        Verwijderen
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 flex gap-2">
                      <input
                        id="voucher"
                        type="text"
                        value={voucherInput}
                        onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                        placeholder="Bijv. RC-AB12-CD34"
                        className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={applyVoucherCode}
                        disabled={voucherStatus === "loading" || !voucherInput.trim()}
                        className="whitespace-nowrap rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-cream hover:bg-coral disabled:opacity-60"
                      >
                        {voucherStatus === "loading" ? "..." : "Toepassen"}
                      </button>
                    </div>
                  )}
                  {voucherError && <p className="mt-2 text-sm text-coral">{voucherError}</p>}
                </div>
              </div>
            )}

            {step === 5 && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Jullie gegevens</h2>
                <p className="mt-1 text-sm text-ink-soft">Zodat we contact kunnen opnemen over het feestje.</p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="parentName" className="text-sm font-semibold">
                      Naam ouder/verzorger
                    </label>
                    <input
                      id="parentName"
                      type="text"
                      value={form.parentName}
                      onChange={(e) => update("parentName", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                    />
                    {errors.parentName && <p className="mt-2 text-sm text-coral">{errors.parentName}</p>}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-semibold">
                      Telefoonnummer
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                    />
                    {errors.phone && <p className="mt-2 text-sm text-coral">{errors.phone}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="email" className="text-sm font-semibold">
                    E-mailadres
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  />
                  {errors.email && <p className="mt-2 text-sm text-coral">{errors.email}</p>}
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="childName" className="text-sm font-semibold">
                      Naam jarige
                    </label>
                    <input
                      id="childName"
                      type="text"
                      value={form.childName}
                      onChange={(e) => update("childName", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                    />
                    {errors.childName && <p className="mt-2 text-sm text-coral">{errors.childName}</p>}
                  </div>
                  <div>
                    <label htmlFor="childAge" className="text-sm font-semibold">
                      Leeftijd jarige
                    </label>
                    <input
                      id="childAge"
                      type="number"
                      min={1}
                      max={14}
                      value={form.childAge}
                      onChange={(e) => update("childAge", e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                    />
                    {errors.childAge && <p className="mt-2 text-sm text-coral">{errors.childAge}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <label htmlFor="notes" className="text-sm font-semibold">
                    Opmerkingen (allergieën, wensen, etc.)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm focus:border-coral focus:outline-none"
                  />
                </div>
              </div>
            )}

            {step === 6 && theme && pkg && (
              <div>
                <h2 className="font-heading text-2xl font-bold">Controleer & bevestig</h2>
                <p className="mt-1 text-sm text-ink-soft">Klopt alles? Dan kun je jullie feestje aanvragen.</p>

                <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Detail label="Thema" value={`${theme.emoji} ${theme.name}`} />
                  <Detail label="Pakket" value={`${pkg.name} (${form.kids} kinderen)`} />
                  <Detail label="Datum" value={form.date || "-"} />
                  <Detail label="Tijd" value={form.time || "-"} />
                  <Detail
                    label="Locatie"
                    value={`${form.locationType === "thuis" ? "Bij ons thuis" : form.locationType === "locatie" ? "Op locatie" : "Anders"}${form.location ? ` · ${form.location}` : ""}`}
                  />
                  <Detail label="Jarige" value={`${form.childName || "-"} (${form.childAge || "-"} jaar)`} />
                  <Detail label="Ouder/verzorger" value={form.parentName || "-"} />
                  <Detail label="Contact" value={`${form.email || "-"} · ${form.phone || "-"}`} />
                </dl>

                {submitError && (
                  <p className="mt-5 rounded-xl bg-coral-soft px-4 py-3 text-sm">{submitError}</p>
                )}

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={status === "loading"}
                  className="mt-8 w-full rounded-full bg-coral px-6 py-4 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {status === "loading" ? "Bezig met versturen..." : "Boeking aanvragen"}
                </button>
              </div>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-ink/10 pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={step === 1}
                className="text-sm font-semibold text-ink-soft disabled:opacity-0"
              >
                ← Vorige
              </button>
              {step < 6 && (
                <button
                  type="button"
                  onClick={goNext}
                  className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream hover:bg-coral"
                >
                  Volgende →
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <BookingSummary
            theme={theme}
            pkg={pkg}
            kids={form.kids}
            extraIds={form.extras}
            discount={appliedDiscount}
            voucher={appliedVoucher}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-cream-soft p-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
