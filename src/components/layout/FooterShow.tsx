"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

function FooterShow() {
    const pathName = usePathname();
    return !pathName.startsWith("/admin") ? <Footer /> : "";
}

export default FooterShow;
