'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, Copy, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className = '',
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string; prefix?: string }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const id = useId();
  const reduced = useReducedMotion();
  return (
    <div className={`segmented ${className}`} role="group" aria-label={label}>
      {options.map((option) => (
        <Button
          key={option.value}
          variant="ghost"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className="segment"
        >
          {value === option.value && (
            <motion.span
              className="segment-fill"
              layoutId={id}
              transition={
                reduced ? { duration: 0 } : { type: 'spring', stiffness: 430, damping: 38 }
              }
            />
          )}
          <span className="segment-label">
            {option.prefix && <span className="segment-prefix">{option.prefix}</span>}
            {option.label}
          </span>
        </Button>
      ))}
    </div>
  );
}

export function CopyButton({
  value,
  label = 'Copy',
  className = '',
}: {
  value: string;
  label?: string;
  className?: string;
}) {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    setState('idle');
    return () => clearTimeout(timer.current);
  }, [value]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('error');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 3000);
  };
  return (
    <span className={`copy-control ${className}`}>
      <Button
        variant="ghost"
        size="lg"
        onClick={copy}
        aria-label={state === 'copied' ? 'Copied to clipboard' : label}
      >
        {state === 'copied' ? <Check size={15} /> : <Copy size={15} />}
        <span>{state === 'copied' ? 'Copied' : label}</span>
      </Button>
      <span className="sr-only" role="status">
        {state === 'copied' ? 'Copied to clipboard.' : ''}
      </span>
      {state === 'error' && (
        <span className="copy-error" role="status">
          Select the text to copy manually.
        </span>
      )}
    </span>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(document.documentElement.classList.contains('dark'));
    sync();
    const followSystem = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem('news-theme');
      } catch {}
      if (!saved) {
        document.documentElement.classList.toggle('dark', media.matches);
        sync();
      }
    };
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('news-theme', next ? 'dark' : 'light');
    } catch {}
  };
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </Button>
  );
}

export function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  return (
    <span
      ref={ref}
      className="magnetic"
      onPointerMove={(event) => {
        if (reduced || event.pointerType !== 'mouse' || !ref.current) return;
        const box = event.currentTarget.getBoundingClientRect();
        ref.current.style.transform = `translate(${(event.clientX - box.left - box.width / 2) * 0.08}px, ${(event.clientY - box.top - box.height / 2) * 0.12}px)`;
      }}
      onPointerLeave={() => {
        if (ref.current) ref.current.style.transform = '';
      }}
    >
      {children}
    </span>
  );
}
