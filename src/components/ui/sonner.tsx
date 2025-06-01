"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-right"
      expand
      richColors
      closeButton
      style={
        {
          "--normal-bg": "hsl(24 9.8% 10%)",
          "--normal-text": "hsl(0 0% 95%)",
          "--normal-border": "hsl(240 3.7% 15.9%)",
          "--success-bg": "hsl(142 76% 36%)",
          "--success-text": "hsl(355 7% 97%)",
          "--error-bg": "hsl(0 84% 60%)",
          "--error-text": "hsl(355 7% 97%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "hsl(24 9.8% 10%)",
          color: "hsl(0 0% 95%)",
          border: "1px solid hsl(240 3.7% 15.9%)",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
