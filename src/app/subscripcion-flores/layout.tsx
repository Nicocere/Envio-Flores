import CartMoreProducts from "@/componentes/CartMoreProducts/CartMoreProducts";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <main>

      {children}

      <CartMoreProducts />
    </main>
  )
}