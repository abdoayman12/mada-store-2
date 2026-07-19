import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z.string().min(3, "الاسم يجب ألا يقل عن 3 أحرف"),
    email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
    phone: z
      .string()
      .min(1, "رقم الهاتف مطلوب")
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري غير صحيح"),
    password: z.string().min(6, "كلمة المرور يجب ألا تقل عن 6 أحرف"),
    confirmPassword: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const contactSchema = z.object({
  name: z.string().min(3, "الاسم يجب ألا يقل عن 3 أحرف"),
  email: z.string().min(1, "البريد الإلكتروني مطلوب").email("صيغة البريد الإلكتروني غير صحيحة"),
  subject: z.string().min(3, "الموضوع مطلوب"),
  message: z.string().min(10, "الرسالة يجب ألا تقل عن 10 أحرف"),
});

export type ContactValues = z.infer<typeof contactSchema>;

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "الاسم الكامل مطلوب"),
  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري غير صحيح"),
  governorate: z.string().min(1, "اختر المحافظة"),
  city: z.string().min(1, "المدينة مطلوبة"),
  address: z.string().min(8, "العنوان التفصيلي مطلوب"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["cod", "card"], { errorMap: () => ({ message: "اختر طريقة الدفع" }) }),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
