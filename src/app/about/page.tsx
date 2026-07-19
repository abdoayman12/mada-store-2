import Image from "next/image";
import Link from "next/link";
import { FiArrowLeft, FiFeather, FiHeart, FiPackage } from "react-icons/fi";
import Button from "@/components/ui/Button";
import SectionDivider from "@/components/ui/SectionDivider";

const values = [
  { icon: FiFeather, title: "اختيار دقيق", desc: "كل منتج بيمر بمراجعة قبل ما ينضم لمدى، مفيش منتج عشوائي." },
  { icon: FiHeart, title: "قرب من العميل", desc: "بنرد على استفساراتك بسرعة، وبنسمع رأيك في كل تفصيلة." },
  { icon: FiPackage, title: "تغليف بعناية", desc: "كل طلب بيوصلك متغلف بشكل أنيق وآمن، لأن التفاصيل بتفرق." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="wrap py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <span className="eyebrow">من نحن</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-snug text-ink">
              مدى مساحة بنختارها بعناية
              <br />
              عشان تشبه ذوقك
            </h1>
            <p className="mt-5 max-w-md leading-8 text-ink-soft">
              بدأنا "مدى" من رغبة بسيطة: نوفر مكان واحد فيه منتجات أصلية ومختارة بعناية، من غير زحمة اختيارات بلا قيمة. اسم مدى نفسه معناه المساحة والامتداد، وده بالظبط اللي بنحاول نقدمه لك: مساحة واسعة من الاختيارات، لكن كل واحدة فيها لها سبب تكون موجودة.
            </p>
            <Link href="/products" className="mt-7 inline-block">
              <Button size="lg">
                تصفحي المنتجات
                <FiArrowLeft size={18} />
              </Button>
            </Link>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-lift">
            <Image src="https://picsum.photos/seed/mada-about/700/880" alt="فريق مدى" fill sizes="50vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section className="bg-cream-soft py-16">
        <div className="wrap text-center">
          <span className="eyebrow justify-center">ليه مدى</span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">القيم اللي بنشتغل بيها</h2>
          <SectionDivider />

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-3xl bg-white p-8 text-right shadow-soft">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-50 text-sage-600">
                  <value.icon size={22} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm leading-7 text-ink-soft">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-16">
        <div className="grid gap-6 rounded-[2.5rem] bg-sage-800 px-8 py-12 text-center text-cream-soft sm:grid-cols-3 sm:px-14">
          <div>
            <p className="font-display text-4xl font-bold">2021</p>
            <p className="mt-1 text-sm text-cream-soft/70">سنة الانطلاق</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold">+2400</p>
            <p className="mt-1 text-sm text-cream-soft/70">عميلة وعميل</p>
          </div>
          <div>
            <p className="font-display text-4xl font-bold">+180</p>
            <p className="mt-1 text-sm text-cream-soft/70">منتج مختار بعناية</p>
          </div>
        </div>
      </section>
    </div>
  );
}
