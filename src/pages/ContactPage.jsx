import React, { useState } from "react";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      toast.success("Message sent — our Addis Ababa team will be in touch soon!");
      setFormData({ name: "", email: "", message: "" });
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <div className="mx-auto grid max-w-7xl flex-1 gap-10 px-5 py-14 md:px-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-ink md:text-3xl">Contact us</h1>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            Tell us where you'd like to go and we'll reply with a customized route suggestion and local tips within two working days.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3 text-ink">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="size-4" />
              </span>
              Bole Road, Addis Ababa, Ethiopia
            </li>
            <li className="flex items-center gap-3 text-ink">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Mail className="size-4" />
              </span>
              hello@ethioexplore.example
            </li>
            <li className="flex items-center gap-3 text-ink">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Phone className="size-4" />
              </span>
              +251 11 000 0000
            </li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft"
        >
          {sent && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 p-3 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4" /> Your inquiry has been received. Thank you!
            </div>
          )}

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Your Name</span>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
              placeholder="e.g. Abebe Bikila"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Email Address</span>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-muted-foreground">Message</span>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
              placeholder="Tell us about the destinations, activities, group size, and travel dates you have in mind..."
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/30"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.99] disabled:opacity-60"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Send className="size-4" /> Send message
              </>
            )}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ContactPage;
