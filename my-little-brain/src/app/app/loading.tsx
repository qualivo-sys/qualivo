/** Esqueleto mientras el servidor arma la pagina: nunca una pantalla en blanco. */
export default function Cargando() {
  return (
    <div className="animate-pulse space-y-4" aria-busy="true" aria-label="Cargando">
      <div className="h-7 w-40 rounded-lg bg-muted" />
      <div className="h-4 w-56 rounded bg-muted/70" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-20 rounded-[var(--radius)] bg-muted/60" />
        ))}
      </div>
      <div className="h-40 rounded-[var(--radius)] bg-muted/60" />
      <div className="h-32 rounded-[var(--radius)] bg-muted/60" />
    </div>
  );
}
