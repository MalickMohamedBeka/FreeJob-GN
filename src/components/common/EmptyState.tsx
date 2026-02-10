/**
 * EmptyState Component
 * Reusable empty state display
 */

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FADE_IN_UP } from '@/constants/animations';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  return (
    <motion.div
      {...FADE_IN_UP}
      className="text-center py-20"
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="inline-block mb-6"
      >
        <div className="w-32 h-32 rounded-full bg-primary opacity-20 blur-2xl mx-auto mb-4" />
        <Icon className="mx-auto text-muted-foreground -mt-28" size={64} />
      </motion.div>

      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground text-lg mb-6 max-w-md mx-auto">
        {description}
      </p>

      {actionLabel && onAction && (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={onAction}
            className="glass rounded-full px-8 py-3 font-semibold shadow-elevation-2 hover:shadow-elevation-3 border border-white/30"
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};
