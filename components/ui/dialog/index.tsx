"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import styles from "./styles.module.css"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    id="modal-backdrop"
    className={cn(styles.dialogOverlay)}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & { screenHeader?: boolean, closeButton?: boolean, location?: "dashboard" | "any" }
>(({ className, location = "any", closeButton = false, screenHeader = false, children, ...props }, ref) => (
  <DialogPortal>
    <div className={styles.dialogBackdrop} />
    <DialogOverlay />
    <div className={styles.dialogContentContainer} >
      <div className={cn(
        styles.dialogContentWrapper,
        location === "dashboard" ? "absolute" : "fixed z-[110]",
        )} tabIndex={-1}>
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "",
            styles.dialogContent,
            className
          )}
          {...props}
        >
          {screenHeader && (
            <>
              <DialogPrimitive.Title className="sr-only">
                Vibr Dialog
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="sr-only">
                This is a dialog for the Vibr app.
              </DialogPrimitive.Description>
            </>
          )}

          {children}
          {closeButton &&
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent-alt data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          }
        </DialogPrimitive.Content>
      </div>
    </div>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogContentWrapper = ({ children }) => {
  return (
    <div data-scrollable="false" data-scroll-at-top="true" className={styles.dialogContentChildWrapper}>
      {children}
    </div>
  )
}

DialogContentWrapper.displayName = "DialogContentWrapper"

const DialogFooterWrapper = ({
  children,
}) => {

  return (
    <div className={styles.dialogFooterWrapper}>
      {children}
    </div>
  )
}

DialogFooterWrapper.displayName = "DialogFooterWrapper"



const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      styles.dialogFooter,
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContentWrapper,
  DialogFooterWrapper
}
