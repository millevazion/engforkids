import Nav from "../components/Nav";
import { SOURCES } from "../data/lessons";

function groupByPublisher(sources) {
  return sources.reduce((acc, source) => {
    const key = source.publisher || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(source);
    return acc;
  }, {});
}

export default function SourcesPage() {
  const sourceList = Object.values(SOURCES);
  const grouped = groupByPublisher(sourceList);
  const publishers = Object.keys(grouped).sort();

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Nav />
      <header className="rounded-3xl bg-white p-8 shadow-card">
        <div className="text-sm font-semibold text-sunrise">Sources</div>
        <h1 className="mt-2 font-title text-3xl font-semibold sm:text-4xl">
          Evidence trail for every lesson and library card.
        </h1>
        <p className="mt-3 text-base text-ink-soft">
          Each source links to the original reference or activity guide used in the app.
        </p>
      </header>

      <section className="mt-8 grid gap-6">
        {publishers.map((publisher) => (
          <article key={publisher} className="rounded-3xl bg-white p-6 shadow-card">
            <h2 className="text-xl font-semibold">{publisher}</h2>
            <div className="mt-4 grid gap-2 text-sm text-ink-soft">
              {grouped[publisher]
                .sort((a, b) => a.title.localeCompare(b.title))
                .map((source) => (
                  <div key={source.id}>
                    <a
                      className="text-sky underline"
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {source.title}
                    </a>
                  </div>
                ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
