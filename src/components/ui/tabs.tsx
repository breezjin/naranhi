'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import * as React from 'react';

import { cn } from '@/lib/utils';

type Tab = {
  title: string;
  value: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
  animated?: boolean;
  animationType?: 'fade' | 'slide' | 'scale';
};

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps & React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(
  (
    {
      tabs,
      defaultValue,
      className,
      listClassName,
      triggerClassName,
      contentClassName,
      animated = true,
      animationType = 'fade',
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue || tabs[0].value);

    const getAnimationVariants = () => {
      switch (animationType) {
        case 'fade':
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          };
        case 'slide':
          return {
            initial: { x: 20, opacity: 0 },
            animate: { x: 0, opacity: 1 },
            exit: { x: -20, opacity: 0 },
          };
        case 'scale':
          return {
            initial: { scale: 0.95, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.95, opacity: 0 },
          };
        default:
          return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          };
      }
    };

    return (
      <TabsPrimitive.Root
        ref={ref}
        value={value}
        onValueChange={setValue}
        className={cn('w-full', className)}
        {...props}
      >
        <TabsPrimitive.List
          className={cn(
            'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
            listClassName
          )}
        >
          {tabs.map((tab) => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
                triggerClassName
              )}
            >
              {tab.title}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>
        {tabs.map((tab) => (
          <TabsPrimitive.Content
            key={tab.value}
            value={tab.value}
            className={cn('mt-2', contentClassName)}
          >
            {animated ? (
              <AnimatePresence mode="wait">
                {value === tab.value && (
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={getAnimationVariants()}
                    transition={{ duration: 0.2 }}
                  >
                    {tab.content}
                  </motion.div>
                )}
              </AnimatePresence>
            ) : (
              value === tab.value && tab.content
            )}
          </TabsPrimitive.Content>
        ))}
      </TabsPrimitive.Root>
    );
  }
);
Tabs.displayName = 'Tabs';

export { Tabs };
