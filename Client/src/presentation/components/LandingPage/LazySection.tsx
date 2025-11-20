import { ReactNode, Suspense, lazy, ComponentType } from "react";

type LazySectionProps = {
  children: ReactNode;
  fallback?: ReactNode;
  className?: string;
};

/**
 * Component để lazy load sections chỉ khi chúng sắp vào viewport
 * Sử dụng Intersection Observer để trigger load
 */
export function LazySection({ 
  children, 
  fallback = <div className="min-h-[400px]" />,
  className = "" 
}: LazySectionProps) {
  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
}

/**
 * Helper để tạo lazy loaded component với preload
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  preloadDelay = 100
) {
  const LazyComponent = lazy(importFn);
  
  // Preload component sau một delay nhỏ để không block initial render
  if (typeof window !== "undefined") {
    setTimeout(() => {
      importFn().catch(() => {
        // Ignore preload errors
      });
    }, preloadDelay);
  }
  
  return LazyComponent;
}

