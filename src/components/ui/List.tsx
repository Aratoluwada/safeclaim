/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  as?: 'ul' | 'ol';
  divided?: boolean;
  spacing?: 'none' | 'sm' | 'md' | 'lg';
}

export const List: React.FC<ListProps> = ({
  as = 'ul',
  divided = false,
  spacing = 'sm',
  className = '',
  children,
  ...props
}) => {
  const Component = as;

  const spacingClasses = {
    none: 'space-y-0',
    sm: 'space-y-1.5',
    md: 'space-y-3',
    lg: 'space-y-4',
  }[spacing];

  const dividedClass = divided
    ? 'divide-y divide-neutral-200 dark:divide-neutral-800'
    : '';

  return (
    <Component
      className={`list-none m-0 p-0 ${spacingClasses} ${dividedClass} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  className?: string;
}

export const ListItem: React.FC<ListItemProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <li className={`m-0 p-0 ${className}`} {...props}>
      {children}
    </li>
  );
};
