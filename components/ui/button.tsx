"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-xl border border-transparent text-sm font-medium whitespace-nowrap transition-all duration-150 outline-none select-none focus-visible:ring-2 focus-visible:ring-blue-600/40 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm active:bg-slate-950",
        outline:
          "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shadow-2xs",
        secondary:
          "bg-blue-50 text-blue-700 border border-blue-200/60 hover:bg-blue-100/80 hover:text-blue-800",
        ghost:
          "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        destructive:
          "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200/60 focus-visible:ring-red-500/40",
        link: "text-blue-600 underline-offset-4 hover:underline font-semibold",
      },
      size: {
        default:
          "h-9 gap-2 px-3.5 py-2",
        xs: "h-7 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-xs",
        lg: "h-11 gap-2.5 rounded-xl px-5 text-base font-semibold",
        icon: "size-9 rounded-xl",
        "icon-xs":
          "size-7 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-lg",
        "icon-lg": "size-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
