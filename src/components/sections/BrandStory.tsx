import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function BrandStory() {
  return (
    <section className="wrap py-16">
      <div className="grid items-center gap-10 overflow-hidden rounded-[2.5rem] bg-sage-800 px-8 py-12 text-cream-soft lg:grid-cols-2 lg:px-14 lg:py-16">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-clay-300">
            <span className="h-1.5 w-1.5 rounded-full bg-clay-300" />
            قصة مدى
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold leading-snug sm:text-4xl">
            مدى يعني المساحة... مساحتك في اختيار ما يناسبك
          </h2>
          <p className="mt-5 max-w-md leading-8 text-cream-soft/75">
            بدأنا مدى من فكرة بسيطة: تسوق إلكتروني يشبهك، بمنتجات حقيقية ومختارة بعناية بدل الكثرة بلا معنى. كل قطعة في متجرنا مرّت باختيار دقيق قبل ما توصلك.
          </p>
          <Link href="/about" className="mt-8 inline-block">
            <Button variant="secondary" size="lg">
              اقرئي قصتنا كاملة
              <FiArrowLeft size={18} />
            </Button>
          </Link>
        </div>

        <div className="relative">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image src="https://picsum.photos/seed/mada-story/800/640" alt="ورشة مدى" fill sizes="40vw" className="object-cover" />
          </div>
          <div className="absolute -bottom-5 -right-5 flex h-24 w-24 items-center justify-center rounded-full bg-clay-400 text-center shadow-lift">
            <span className="font-display text-sm font-bold leading-tight text-cream-soft">
              منذ
              <br />
              2021
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
