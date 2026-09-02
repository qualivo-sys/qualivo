import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { cn } from '@/lib/utils';

/* Componentes en la linea de shadcn/ui: clases de Tailwind sobre elementos
   nativos, sin dependencias de runtime. */

const estilosBoton = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  {
    variants: {
      variante: {
        primario: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secundario: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        contorno: 'border border-border bg-transparent hover:bg-secondary/60',
        fantasma: 'bg-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
        peligro: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      tamano: {
        sm: 'h-9 px-3',
        md: 'h-11 px-4',
        lg: 'h-12 px-6 text-base',
        icono: 'h-10 w-10',
      },
    },
    defaultVariants: { variante: 'primario', tamano: 'md' },
  },
);

export interface PropsBoton
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof estilosBoton> {}

export const Boton = React.forwardRef<HTMLButtonElement, PropsBoton>(
  ({ className, variante, tamano, ...props }, ref) => (
    <button ref={ref} className={cn(estilosBoton({ variante, tamano }), className)} {...props} />
  ),
);
Boton.displayName = 'Boton';

export function Tarjeta({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-[var(--radius)] border border-border bg-card p-4 shadow-sm', className)}
      {...props}
    />
  );
}

export function TituloTarjeta({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('mb-3 text-base font-semibold', className)} {...props} />;
}

export function Insignia({
  className,
  tono = 'neutro',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tono?: 'neutro' | 'exito' | 'aviso' | 'marca' }) {
  const tonos = {
    neutro: 'bg-secondary text-muted-foreground',
    exito: 'bg-emerald-500/15 text-emerald-300',
    aviso: 'bg-amber-500/15 text-amber-300',
    marca: 'bg-primary/20 text-primary',
  };
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', tonos[tono], className)}
      {...props}
    />
  );
}

export function Campo({
  etiqueta,
  ayuda,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { etiqueta: string; ayuda?: string }) {
  const idCampo = id ?? `campo-${etiqueta.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={idCampo} className="block text-sm text-muted-foreground">
        {etiqueta}
      </label>
      <input
        id={idCampo}
        className={cn(
          'h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-base outline-none placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-ring',
          className,
        )}
        {...props}
      />
      {ayuda && <p className="text-xs text-muted-foreground">{ayuda}</p>}
    </div>
  );
}

export function Selector({
  etiqueta,
  className,
  id,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { etiqueta: string }) {
  const idCampo = id ?? `sel-${etiqueta.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className="space-y-1.5">
      <label htmlFor={idCampo} className="block text-sm text-muted-foreground">
        {etiqueta}
      </label>
      <select
        id={idCampo}
        className={cn(
          'h-11 w-full rounded-lg border border-input bg-muted/40 px-3 text-base outline-none focus:ring-2 focus:ring-ring',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

/** Barra de progreso simple. El valor va tambien en texto al lado. */
export function Barra({ valor, color = 'hsl(var(--primary))' }: { valor: number; color?: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${Math.max(0, Math.min(100, valor))}%`, background: color }}
      />
    </div>
  );
}
