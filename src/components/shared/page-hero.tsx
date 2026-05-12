interface PageHeroProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  compact = false,
  className = "",
}: PageHeroProps) {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary-light ${
        compact ? "py-12 sm:py-16" : "py-16 sm:py-24"
      } ${className}`}
    >
      {/* Decorative geometry */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/8" />
        <div className="absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-white/5" />
        <div className="absolute right-1/4 top-1/2 h-2 w-2 rounded-full bg-accent/40" />
        <div className="absolute left-1/3 top-1/4 h-1.5 w-1.5 rounded-full bg-white/20" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/75 sm:text-lg">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
