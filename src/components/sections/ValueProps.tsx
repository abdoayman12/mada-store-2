import { FiTruck, FiRefreshCw, FiShield, FiHeadphones } from "react-icons/fi";

const items = [
  { icon: FiTruck, title: "شحن لكل المحافظات", desc: "يصل خلال 2-5 أيام عمل" },
  { icon: FiRefreshCw, title: "إرجاع خلال 14 يوم", desc: "بدون أي تعقيد" },
  { icon: FiShield, title: "دفع آمن", desc: "عند الاستلام أو بالبطاقة" },
  { icon: FiHeadphones, title: "دعم سريع", desc: "نرد خلال ساعات العمل" },
];

export default function ValueProps() {
  return (
    <section className="border-y border-line bg-cream-soft">
      <div className="wrap grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sage-50 text-sage-600">
              <item.icon size={19} />
            </div>
            <div>
              <p className="text-sm font-bold text-ink">{item.title}</p>
              <p className="text-xs text-ink-soft">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
