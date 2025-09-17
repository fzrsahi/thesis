"use client";

import React from "react";

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

type DarkModalRootProps = React.ComponentProps<typeof Dialog>;
type DarkModalTriggerProps = React.ComponentProps<typeof DialogTrigger>;
type DarkModalContentProps = React.ComponentProps<typeof DialogContent>;
type DarkModalHeaderProps = React.ComponentProps<typeof DialogHeader>;
type DarkModalTitleProps = React.ComponentProps<typeof DialogTitle>;
type DarkModalDescriptionProps = React.ComponentProps<typeof DialogDescription>;
type DarkModalFooterProps = React.ComponentProps<typeof DialogFooter>;
type DarkModalCloseProps = React.ComponentProps<typeof DialogClose>;

export const DarkModal = {
  Root: (props: DarkModalRootProps) => <Dialog {...props} />,
  Trigger: (props: DarkModalTriggerProps) => <DialogTrigger {...props} />,
  Content: ({ className, ...rest }: DarkModalContentProps) => (
    <DialogContent
      className={`border-zinc-800 bg-zinc-900 text-white ${className ?? ""}`}
      {...rest}
    />
  ),
  Header: ({ className, ...rest }: DarkModalHeaderProps) => (
    <DialogHeader className={`border-b border-zinc-800 ${className ?? ""}`} {...rest} />
  ),
  Title: ({ className, ...rest }: DarkModalTitleProps) => (
    <DialogTitle className={`text-white ${className ?? ""}`} {...rest} />
  ),
  Description: ({ className, ...rest }: DarkModalDescriptionProps) => (
    <DialogDescription className={`text-zinc-400 ${className ?? ""}`} {...rest} />
  ),
  Footer: ({ className, ...rest }: DarkModalFooterProps) => (
    <DialogFooter className={`border-t border-zinc-800 ${className ?? ""}`} {...rest} />
  ),
  Close: (props: DarkModalCloseProps) => <DialogClose {...props} />,
};

export default DarkModal;
