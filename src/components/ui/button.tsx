import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-[#6378eb] text-white shadow-xs hover:bg-[#7f94f2]',
        destructive:
          'bg-[#73ccd7] text-white shadow-xs hover:bg-[#92d6de] focus-visible:ring-[#73ccd7]/20 dark:focus-visible:ring-[#73ccd7]/40 dark:bg-[#73ccd7]/60',
        outline:
          'border shadow-xs hover:bg-[#f2f9fb] hover:text-[#6378eb] dark:bg-[#dbeef1]/30 dark:border-[#d0e9ec] dark:hover:bg-[#d0e9ec]/50',
        secondary: 'bg-[#b9ccff] text-[#6378eb] shadow-xs hover:bg-[#c3d3ff]',
        ghost: 'hover:bg-[#e7f4f6] hover:text-[#6378eb] dark:hover:bg-[#dbeef1]/50',
        link: 'text-[#6378eb] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-6 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
