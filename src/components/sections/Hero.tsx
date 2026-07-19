import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { products } from "@/lib/data";

export default function Hero() {
  const featured = products[0];
  const small1 = products[1];
  const small2 = products[2];

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="wrap grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <div className="relative z-10 order-2 lg:order-1">
          <span className="eyebrow">قطع مختارة بعناية</span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.25] text-ink sm:text-5xl">
            على مدى يومك،
            <br />
            اختاري ما يليق بك
          </h1>
          <p className="mt-5 max-w-md text-base leading-8 text-ink-soft">
            من العناية الشخصية إلى تفاصيل المنزل، مدى يجمع لكِ منتجات أصلية ومختارة بعناية فائقة، لتجربة تسوق بسيطة وموثوقة من أول طلب.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/products">
              <Button size="lg">
                تسوقي الآن
                <FiArrowLeft size={18} />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                تعرفي على مدى
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-8 border-t border-line pt-6">
            <div>
              <p className="font-display text-2xl font-bold text-sage-700">+2400</p>
              <p className="text-xs text-ink-soft">عميلة سعيدة</p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl font-bold text-sage-700">+180</p>
              <p className="text-xs text-ink-soft">منتج مختار</p>
            </div>
            <div className="h-8 w-px bg-line" />
            <div>
              <p className="font-display text-2xl font-bold text-sage-700">4.8</p>
              <p className="text-xs text-ink-soft">تقييم العملاء</p>
            </div>
          </div>
        </div>

        <div className="relative order-1 z-10 lg:order-2">
          <div className="absolute -inset-x-6 -inset-y-8 -z-10 rounded-[3rem] bg-sage-100/70" />
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lift">
              <Image src={featured.image} alt={featured.name} fill sizes="40vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-4 pt-10">
              <div className="relative aspect-square overflow-hidden rounded-3xl shadow-card animate-drift">
                <Image src={small1.image} alt={small1.name} fill sizes="20vw" className="object-cover" />
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-card">
                <Image src={small2.image} alt={small2.name} fill sizes="20vw" className="object-cover" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 right-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-50 text-clay-500">
              <span className="font-display text-base font-bold">٪20</span>
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-ink">خصم على أول طلب</p>
              <p className="text-[11px] text-ink-soft">عند التسجيل في النشرة</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
