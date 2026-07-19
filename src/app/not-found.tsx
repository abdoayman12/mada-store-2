import Link from "next/link";
import { FiCompass } from "react-icons/fi";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sage-50 text-sage-600">
        <FiCompass size={26} />
      </div>
      <h1 className="font-display text-3xl font-bold text-ink">الصفحة مش موجودة</h1>
      <p className="max-w-sm text-sm text-ink-soft">يمكن الرابط اتغير أو الصفحة مش متاحة دلوقتي، يلا نرجعلك للرئيسية.</p>
      <Link href="/">
        <Button>العودة للرئيسية</Button>
      </Link>
    </div>
  );
}
