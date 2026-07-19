import Hero from "@/components/sections/Hero";
import ValueProps from "@/components/sections/ValueProps";
import Categories from "@/components/sections/Categories";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import BrandStory from "@/components/sections/BrandStory";
import Newsletter from "@/components/sections/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Categories />
      <FeaturedProducts />
      <BrandStory />
      <Newsletter />
    </>
  );
}
