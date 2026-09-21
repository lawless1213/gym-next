import { IconCheck, IconMinus } from "@tabler/icons-react";
import { FEATURES } from "@/data/subscribe";


export default function Features() {
  return (
    <section
        className="mt-8"
        aria-labelledby="features-title">
        <h3
          id="features-title"
          className="text-lg font-semibold">
        </h3>

        <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card">
          <div className="grid grid-cols-[1fr_3rem_4rem] items-center gap-2 border-b border-border px-4 py-2 text-xs text-muted-foreground">
            <span />
            <span className="text-center">Free</span>
            <span className="text-center font-medium text-primary">Premium</span>
          </div>

          <ul className="divide-y divide-border">
            {FEATURES.map(({ icon: Icon, title, description, free }) => (
              <li
                key={title}
                className="grid grid-cols-[1fr_3rem_4rem] items-center gap-2 px-4 py-3">
                <div className="flex min-w-0 items-start gap-3">
                  <Icon
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>

                <span className="grid place-items-center">
                  {free ? (
                    <>
                      <IconCheck
                        className="size-4 text-muted-foreground"
                        aria-hidden
                      />
                      <span className="sr-only">Є у безкоштовному плані</span>
                    </>
                  ) : (
                    <>
                      <IconMinus
                        className="size-4 text-muted-foreground/40"
                        aria-hidden
                      />
                      <span className="sr-only">Немає у безкоштовному плані</span>
                    </>
                  )}
                </span>

                <span className="grid place-items-center">
                  <IconCheck
                    className="size-4 text-primary"
                    stroke={3}
                    aria-hidden
                  />
                  <span className="sr-only">Є в Premium</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
  );
}
