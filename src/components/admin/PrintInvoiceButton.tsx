"use client";

export default function PrintInvoiceButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coral print:hidden"
    >
      Print / opslaan als PDF
    </button>
  );
}
