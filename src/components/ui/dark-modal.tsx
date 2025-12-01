"use client";

import React, { createContext, useContext } from "react";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type DarkModalVariant = "dark" | "light";

type WithVariant<T> = T & { variant?: DarkModalVariant };

type DarkModalRootProps = WithVariant<React.ComponentProps<typeof Dialog>>;
type DarkModalTriggerProps = React.ComponentProps<typeof DialogTrigger>;
type DarkModalContentProps = WithVariant<React.ComponentProps<typeof DialogContent>>;
type DarkModalHeaderProps = WithVariant<React.ComponentProps<typeof DialogHeader>>;
type DarkModalTitleProps = WithVariant<React.ComponentProps<typeof DialogTitle>>;
type DarkModalDescriptionProps = WithVariant<React.ComponentProps<typeof DialogDescription>>;
type DarkModalFooterProps = WithVariant<React.ComponentProps<typeof DialogFooter>>;
type DarkModalCloseProps = React.ComponentProps<typeof DialogClose>;

const VariantContext = createContext<DarkModalVariant>("dark");

const variantStyles = {
  dark: {
    content: "border-zinc-800 bg-zinc-900 text-white",
    header: "border-b border-zinc-800",
    title: "text-white",
    description: "text-zinc-400",
    footer: "border-t border-zinc-800",
  },
  light: {
    content: "border-zinc-200 bg-white text-zinc-900",
    header: "border-b border-zinc-200",
    title: "text-zinc-900",
    description: "text-zinc-500",
    footer: "border-t border-zinc-200",
  },
} satisfies Record<DarkModalVariant, Record<string, string>>;

const useVariant = (override?: DarkModalVariant) => {
  const contextValue = useContext(VariantContext);
  return override ?? contextValue;
};

export const DarkModal = {
  Root: ({ variant = "dark", ...props }: DarkModalRootProps) => (
    <VariantContext.Provider value={variant}>
      <Dialog {...props} />
    </VariantContext.Provider>
  ),
  Trigger: (props: DarkModalTriggerProps) => <DialogTrigger {...props} />,
  Content: ({ className, variant, ...rest }: DarkModalContentProps) => {
    const resolvedVariant = useVariant(variant);
    return (
      <DialogContent className={cn(variantStyles[resolvedVariant].content, className)} {...rest} />
    );
  },
  Header: ({ className, variant, ...rest }: DarkModalHeaderProps) => {
    const resolvedVariant = useVariant(variant);
    return (
      <DialogHeader className={cn(variantStyles[resolvedVariant].header, className)} {...rest} />
    );
  },
  Title: ({ className, variant, ...rest }: DarkModalTitleProps) => {
    const resolvedVariant = useVariant(variant);
    return (
      <DialogTitle className={cn(variantStyles[resolvedVariant].title, className)} {...rest} />
    );
  },
  Description: ({ className, variant, ...rest }: DarkModalDescriptionProps) => {
    const resolvedVariant = useVariant(variant);
    return (
      <DialogDescription
        className={cn(variantStyles[resolvedVariant].description, className)}
        {...rest}
      />
    );
  },
  Footer: ({ className, variant, ...rest }: DarkModalFooterProps) => {
    const resolvedVariant = useVariant(variant);
    return (
      <DialogFooter className={cn(variantStyles[resolvedVariant].footer, className)} {...rest} />
    );
  },
  Close: (props: DarkModalCloseProps) => <DialogClose {...props} />,
};

export default DarkModal;
