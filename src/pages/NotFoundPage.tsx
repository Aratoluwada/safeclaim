/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  useEffect(() => {
    document.title = '404 Page Not Found — SafeClaim AI';
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-left space-y-6">
      <div className="font-mono text-xs uppercase font-bold text-neutral-400">
        HTTP 404 &bull; Record Not Found
      </div>
      <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-50">
        Page Not Found
      </h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400 font-sans leading-relaxed">
        The requested URL was not found in the SafeClaim routing registry. Please return to the homepage or search for verified guidance directly.
      </p>
      <div className="flex items-center gap-3 pt-2">
        <NavLink to="/">
          <Button variant="secondary" size="md">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Button>
        </NavLink>
        <NavLink to="/ask">
          <Button variant="primary" size="md">
            <Search className="w-4 h-4" />
            <span>Ask SafeClaim</span>
          </Button>
        </NavLink>
      </div>
    </div>
  );
};
