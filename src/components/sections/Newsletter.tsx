"use client";

import { SubmitEvent, useState } from "react";
import { FiCheck } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSent(true);
  }

  return (
    <section className="wrap pb-20">
      <div className="rounded-3xl bg-clay-50 px-6 py-10 text-center sm:px-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">اشتركي واحصلي على خصم 20٪</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          سجّلي بريدك الإلكتروني عشان توصلك مختاراتنا الجديدة وكوبونات حصرية أول بأول.
        </p>

        {sent ? (
          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-full bg-sage-600 px-5 py-3 text-sm font-bold text-cream-soft">
            <FiCheck size={18} />
            تم الاشتراك بنجاح، تابعي بريدك الإلكتروني
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              required
              placeholder="بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" className="shrink-0">
              اشتركي الآن
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
