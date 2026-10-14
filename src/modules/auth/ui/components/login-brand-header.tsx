import React from 'react';
import { Smartphone } from 'lucide-react';

export function LoginBrandHeader() {
  return (
    <header className="flex items-center gap-3.5">
      <div className="w-12 h-12 rounded-2xl bg-brand-primary-dark flex items-center justify-center shadow-xs">
        <Smartphone className="w-6 h-6 text-brand-secondary" strokeWidth={2.2} />
      </div>
      <div>
        <h1 className="text-base font-bold text-text-primary font-heading leading-tight tracking-tight">
          UniPutumayo
        </h1>
        <p className="text-xs text-text-muted font-body">
          Sistema Comercial Universal
        </p>
      </div>
    </header>
  );
}
