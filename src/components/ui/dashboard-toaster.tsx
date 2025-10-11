"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";

const DashboardToaster = ({ ...props }: ToasterProps) => (
    <Sonner
      className="toaster group"
      position="top-right"
      expand
      richColors
      closeButton
      style={
        {
          "--normal-bg": "hsl(0 0% 0%)",
          "--normal-text": "hsl(0 0% 100%)",
          "--normal-border": "hsl(0 0% 20%)",
          "--success-bg": "hsl(0 0% 0%)",
          "--success-text": "hsl(0 0% 100%)",
          "--success-border": "hsl(142 76% 36%)",
          "--error-bg": "hsl(0 0% 0%)",
          "--error-text": "hsl(0 0% 100%)",
          "--error-border": "hsl(0 84% 60%)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "hsl(0 0% 0%)",
          color: "hsl(0 0% 100%)",
          border: "1px solid hsl(0 0% 20%)",
        },
      }}
      {...props}
    />
  );

export { DashboardToaster };
