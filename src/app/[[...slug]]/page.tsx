import React from 'react';
import { ClientOnly } from './client'

// Configuración para exportación estática
export const dynamic = 'error';

export function generateStaticParams() {
  return [{ slug: [''] }]
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  console.log('slug', slug)
  return <ClientOnly />
}