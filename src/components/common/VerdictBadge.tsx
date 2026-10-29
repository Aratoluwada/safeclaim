/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VerdictLabel } from '../../types/api';
import { VerdictStamp } from './VerdictStamp';

interface VerdictBadgeProps {
  verdict: VerdictLabel;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showIcon?: boolean;
  customLabel?: string;
  rotate?: boolean;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = (props) => {
  return <VerdictStamp {...props} />;
};
