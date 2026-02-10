/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 border-2',
  md: 'w-16 h-16 border-4',
  lg: 'w-24 h-24 border-4',
};

export const LoadingSpinner = ({
  size = 'md',
  className,
  text,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4', className)}>
      <motion.div
        className={cn(
          'border-primary border-t-transparent rounded-full',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {text && (
        <p className="text-muted-foreground text-sm font-medium">{text}</p>
      )}
    </div>
  );
};
