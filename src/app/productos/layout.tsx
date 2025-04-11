import CarouselComponent from "@/componentes/Carousel/Carousel";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <main>
      <CarouselComponent />

      {children}
    </main>
  )
}