import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-accent-primary/20 text-accent-primary",
        secondary: "bg-bg-tertiary text-text-secondary border border-border-default",
        success: "bg-accent-success/20 text-accent-success",
        warning: "bg-accent-warning/20 text-accent-warning",
        danger: "bg-accent-danger/20 text-accent-danger",
        info: "bg-accent-info/20 text-accent-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
