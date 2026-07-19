"use client";

import { FormEvent, useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiCheck } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { FieldWrapper, Input, Textarea } from "@/components/ui/Input";
import { contactSchema, ContactValues } from "@/lib/validations";

const initialValues: ContactValues = { name: "", email: "", subject: "", message: "" };

const infoCards = [
  { icon: FiPhone, title: "اتصلي بنا", value: "01000000000" },
  { icon: FiMail, title: "راسلينا", value: "support@mada-store.com" },
  { icon: FiMapPin, title: "موقعنا", value: "القاهرة، مصر" },
];

export default function ContactPage() {
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactValues;
        fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    // TODO: wire to a Next.js server action / API route once the backend is ready
  }

  return (
    <div className="wrap py-16">
      <div className="text-center">
        <span className="eyebrow justify-center">تواصل معنا</span>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">إحنا هنا لأي استفسار</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink-soft">
          سواء عندك سؤال عن طلب أو منتج أو اقتراح، تقدري تبعتيلنا وفريقنا هيرد عليكِ في أقرب وقت.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-4">
          {infoCards.map((card) => (
            <div key={card.title} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-soft">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-50 text-sage-600">
                <card.icon size={19} />
              </div>
              <div>
                <p className="text-xs text-ink-soft">{card.title}</p>
                <p className="text-sm font-bold text-ink" dir="ltr">{card.value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl bg-sage-800 p-6 text-cream-soft">
            <p className="font-display text-lg font-bold">ساعات العمل</p>
            <p className="mt-2 text-sm text-cream-soft/75">السبت – الخميس: 10ص – 8م</p>
            <p className="text-sm text-cream-soft/75">الجمعة: إجازة</p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-soft sm:p-8">
          {submitted ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage-50 text-sage-600">
                <FiCheck size={26} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">تم إرسال رسالتك بنجاح</h3>
              <p className="max-w-xs text-sm text-ink-soft">هنتواصل معاكِ على بريدك الإلكتروني في أقرب وقت ممكن.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <FieldWrapper label="الاسم الكامل" required error={errors.name}>
                  <Input value={values.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="مثال: سارة أحمد" />
                </FieldWrapper>
                <FieldWrapper label="البريد الإلكتروني" required error={errors.email}>
                  <Input
                    type="email"
                    dir="ltr"
                    value={values.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="example@email.com"
                  />
                </FieldWrapper>
              </div>
              <FieldWrapper label="الموضوع" required error={errors.subject}>
                <Input value={values.subject} onChange={(e) => handleChange("subject", e.target.value)} placeholder="عنوان رسالتك" />
              </FieldWrapper>
              <FieldWrapper label="الرسالة" required error={errors.message}>
                <Textarea value={values.message} onChange={(e) => handleChange("message", e.target.value)} placeholder="اكتبي رسالتك هنا..." />
              </FieldWrapper>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                إرسال الرسالة
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
