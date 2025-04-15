"use client";

import CartHome from '@/Client/CartHome/CartHome';
import style from './detail.module.css'
import dynamic from 'next/dynamic'

const CartMoreProducts = dynamic(() => import('.././../componentes/CartMoreProducts/CartMoreProducts'), { ssr: false })
export default function Layout({ children }: { children: React.ReactNode }) {
    
  return (
    <main className={style.mainDetailContainer}>
      <CartHome/>
      {children}
      <CartMoreProducts/>
    </main>
  )
}