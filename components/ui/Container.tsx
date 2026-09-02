import type { ReactNode } from 'react';

type Element = 'div' | 'main' | 'section' | 'header' | 'footer' | 'article';

interface ContainerProps {
  children: ReactNode;
  as?: Element;
  className?: string;
  /** Narrow width for long-form reading measure. */
  width?: 'default' | 'narrow';
  id?: string;
}

/**
 * Centered content container with a consistent horizontal rhythm and a
 * readable maximum width. `narrow` constrains to a comfortable reading measure.
 */
export function Container({
  children,
  as: Tag = 'div',
  className = '',
  width = 'default',
  id,
}: ContainerProps) {
  const max = width === 'narrow' ? 'max-w-3xl' : 'max-w-content';
  return (
    <Tag
      id={id}
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${max} ${className}`}
    >
      {children}
    </Tag>
  );
}
