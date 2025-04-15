"use client"

import  SearchProvider  from "@/context/SearchContext";
import  CartProvider  from "@/context/CartContext";
import {ContextProvider}  from '@/context/Context';
import { ProductsProvider }  from "@/context/ProductsContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { ThemeProvider } from '@/context/ThemeSwitchContext';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { LocalizationProvider } from '@mui/x-date-pickers';

export default function Providers({ children }: { children: React.ReactNode }) {
  // "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  const initialOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX || "",
    currency: "USD",
    intent: "capture",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>

        <CartProvider>
          <ThemeProvider>
            <ProductsProvider>
              <ContextProvider>
                <SearchProvider>
                  {children}
                </SearchProvider>
              </ContextProvider>
            </ProductsProvider>
          </ThemeProvider>
        </CartProvider>
      </LocalizationProvider>
    </PayPalScriptProvider>
  );
}