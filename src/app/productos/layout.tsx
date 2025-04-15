import CartHome from "@/Client/CartHome/CartHome";
import CarouselComponent from "@/componentes/Carousel/Carousel";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <main>
      <CartHome />
      {children}
    </main>
  )
}