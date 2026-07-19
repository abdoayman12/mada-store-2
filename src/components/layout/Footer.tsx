import Image from "next/image";
import Link from "next/link";
import { FiInstagram, FiFacebook, FiTwitter } from "react-icons/fi";

const columns = [
  {
    title: "المتجر",
    links: [
      { href: "/products", label: "كل المنتجات" },
      { href: "/products", label: "الأكثر طلبًا" },
      { href: "/products", label: "وصل حديثًا" },
    ],
  },
  {
    title: "الشركة",
    links: [
      { href: "/about", label: "من نحن" },
      { href: "/contact", label: "تواصل معنا" },
    ],
  },
  {
    title: "حسابي",
    links: [
      { href: "/login", label: "تسجيل الدخول" },
      { href: "/register", label: "إنشاء حساب" },
      { href: "/cart", label: "السلة" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-sage-800 text-cream-soft">
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Image src="/Untitled-1.png" alt="مدى" width={64} height={36} className="h-12 w-auto object-contain brightness-0 invert opacity-90" />
          <p className="max-w-xs text-sm leading-7 text-cream-soft/70">
            مدى متجرك لمنتجات مختارة بعناية للمنزل والعناية الشخصية، نجمع بين الجودة والبساطة في كل قطعة.
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[FiInstagram, FiFacebook, FiTwitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="تابعنا"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream-soft transition hover:bg-clay-500"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title} className="space-y-3">
            <h4 className="font-display text-sm font-bold text-cream-soft">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-cream-soft/70 transition hover:text-clay-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-soft/60 sm:flex-row">
          <span>© {new Date().getFullYear()} مدى. جميع الحقوق محفوظة.</span>
          <span>صُنع بعناية لتجربة تسوق بسيطة وموثوقة</span>
        </div>
      </div>
    </footer>
  );
}
