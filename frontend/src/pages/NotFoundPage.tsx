/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Search } from 'lucide-react';
import { NotFoundIllustration } from '../components/illustrations';
import { WobblyUnderline } from '../components/hand/WobblyUnderline';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 Page Not Found — SafeClaim AI';
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
      <div className="flex justify-center">
        <NotFoundIllustration size={140} />
      </div>

      <div className="font-mono text-xs uppercase font-bold text-[#8E8273]">
        HTTP 404 • Official Archive Record Missing
      </div>

      <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1F1B16] dark:text-[#F4EEE4]">
        Page Not Found in{' '}
        <span className="relative inline-block">
          Gazette Registry
          <WobblyUnderline className="absolute -bottom-2 left-0 w-full" color="#B91C1C" />
        </span>
      </h1>

      <p className="text-sm sm:text-base text-[#63584C] dark:text-[#A89E90] font-body leading-relaxed max-w-lg mx-auto">
        The requested URL was not found in the SafeClaim routing registry. Please return to the public verification desk or search for verified guidance directly.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <NavLink to="/">
          <Button variant="secondary" size="md" className="font-bold">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>
        </NavLink>
        <NavLink to="/ask">
          <Button variant="primary" size="md" className="font-bold">
            <Search className="w-4 h-4" />
            <span>Ask SafeClaim</span>
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
