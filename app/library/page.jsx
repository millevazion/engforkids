"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import { LIBRARY, MEDIA, SOURCES, LESSONS, LEVELS } from "../data/lessons";
import {
  Hammer,
  Layers,
  Sparkles,
  ScrollText,
  Lock,
  Shuffle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const STORAGE_KEY = "eng-quest-progress-v2";
const DEFAULT_PROGRESS = { completed: {}, quiz: {} };

function useStoredState(key, fallback) {
  const [value, setValue] = useState(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw));
    } catch (err) {
      setValue(fallback);
    } finally {
      setHydrated(true);
    }
  }, [key, fallback]);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value, hydrated]);

  return [value, setValue];
}

function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function SourcePills({ sources }) {
  if (!sources?.length) return null;
  const labels = Array.from(
    new Set(sources.map((id) => SOURCES[id]?.publisher).filter(Boolean))
  );
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-soft">
      {labels.map((label) => (
        <span key={label} className="rounded-full bg-sand-2 px-2 py-1">
          {label}
        </span>
      ))}
    </div>
  );
}

function PracticeDeck({ deck }) {
  const [order, setOrder] = useState(() => deck.questions.map((_, i) => i));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = order.length;
  const current = deck.questions[order[index]];
  const progress = Math.round(((index + 1) / total) * 100);

  const accentMap = {
    sunrise: {
      ring: "ring-sunrise/30",
      button: "bg-sunrise text-white",
      glow: "from-sunrise/20",
    },
    mint: {
      ring: "ring-mint/30",
      button: "bg-mint text-white",
      glow: "from-mint/20",
    },
    sky: {
      ring: "ring-sky/30",
      button: "bg-sky text-white",
      glow: "from-sky/20",
    },
  };

  const accent = accentMap[deck.accent] || accentMap.sunrise;

  const goNext = () => {
    setIndex((prev) => (prev + 1) % total);
    setFlipped(false);
  };

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + total) % total);
    setFlipped(false);
  };

  const shuffle = () => {
    setOrder((prev) => shuffleArray(prev));
    setIndex(0);
    setFlipped(false);
  };

  return (
    <article className="rounded-3xl bg-white p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold sm:text-3xl">{deck.title}</h2>
          <div className="mt-1 text-sm text-ink-soft">{deck.level}</div>
          <p className="mt-2 text-base text-ink-soft">{deck.blurb}</p>
        </div>
        <div className="rounded-2xl bg-sand-2 px-4 py-3 text-center">
          <div className="text-xs font-semibold text-ink-soft">Card</div>
          <div className="text-2xl font-semibold">
            {index + 1}/{total}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="h-2 w-full rounded-full bg-sand-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${accent.glow} to-transparent`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <button
          type="button"
          onClick={() => setFlipped((prev) => !prev)}
          className={`flip-card relative min-h-[220px] rounded-3xl p-2 text-left shadow-card ring-2 ${accent.ring} ${
            flipped ? "flipped" : ""
          }`}
          aria-pressed={flipped}
        >
          <div className="flip-card-inner">
            <div className="flip-card-face rounded-3xl bg-sand/70 p-6">
              <div className="text-xs font-semibold uppercase text-ink-soft">
                Question
              </div>
              <div className="mt-3 text-xl font-semibold sm:text-2xl">
                {current.q}
              </div>
              <div className="mt-4 text-sm text-ink-soft">
                Hint: {current.hint}
              </div>
              <div className="mt-6 text-xs font-semibold text-ink-soft">
                Tap to flip
              </div>
            </div>
            <div className="flip-card-face flip-card-back rounded-3xl bg-white p-6">
              <div className="text-xs font-semibold uppercase text-ink-soft">
                Answer
              </div>
              <div className="mt-3 text-xl font-semibold sm:text-2xl">
                {current.a}
              </div>
              <SourcePills sources={current.sources} />
              <div className="mt-6 text-xs font-semibold text-ink-soft">
                Tap to flip back
              </div>
            </div>
          </div>
        </button>

        <div className="rounded-3xl border border-sand-2 bg-sand/40 p-5">
          <div className="text-sm font-semibold text-ink">Deck Controls</div>
          <p className="mt-2 text-sm text-ink-soft">
            Flip the card, then move to the next challenge. Shuffle for a new order.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFlipped((prev) => !prev)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${accent.button}`}
            >
              {flipped ? "Hide Answer" : "Reveal Answer"}
            </button>
            <button
              type="button"
              onClick={goPrev}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft"
            >
              <ChevronLeft className="mr-1 inline h-4 w-4" /> Prev
            </button>
            <button
              type="button"
              onClick={goNext}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft"
            >
              Next <ChevronRight className="ml-1 inline h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={shuffle}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink-soft"
            >
              <Shuffle className="mr-1 inline h-4 w-4" /> Shuffle
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function LibraryPage() {
  const [tab, setTab] = useState("build");
  const [openBuildId, setOpenBuildId] = useState(null);
  const [progress] = useStoredState(STORAGE_KEY, DEFAULT_PROGRESS);

  const levelStats = useMemo(() => {
    return LEVELS.map((level) => {
      const lessons = LESSONS.filter((item) => item.level === level.level);
      const completedCount = lessons.filter((item) => progress.completed?.[item.id])
        .length;
      return {
        ...level,
        total: lessons.length,
        completedCount,
      };
    });
  }, [progress]);

  const levelComplete = (levelNumber) => {
    const stat = levelStats.find((item) => item.level === levelNumber);
    return stat ? stat.completedCount === stat.total : false;
  };

  const unlocks = {
    build: true,
    practice: levelComplete(1),
    visual: levelComplete(2),
    notes: levelComplete(3),
  };

  const tabs = [
    { id: "build", label: "Build Cards", icon: Hammer },
    { id: "practice", label: "Practice Decks", icon: Layers },
    { id: "visual", label: "Visual Blueprints", icon: Sparkles },
    { id: "notes", label: "Engineer Notes", icon: ScrollText },
  ];

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Nav />

      <header className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card">
        <div className="absolute -right-16 -top-12 h-48 w-48 rounded-full bg-sky/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-sun/30 blur-3xl" />
        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="text-sm font-semibold text-sunrise">Artifact Library</div>
            <h1 className="mt-2 font-title text-3xl font-semibold sm:text-4xl">
              Build, play, and level up your engineering skills.
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              The library is split into four shelves. Each shelf unlocks as Antoine
              completes the core lessons. Sources live on the Sources page.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href="/sources"
                className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
              >
                Sources
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-sand-2 bg-sand/60 p-6">
            <div className="text-sm font-semibold text-ink">Unlock Tracker</div>
            <p className="mt-2 text-sm text-ink-soft">
              Finish Level 1 to unlock Practice Decks, Level 2 for Blueprints, Level 3 for Engineer Notes.
            </p>
            <div className="mt-4 grid gap-2">
              {levelStats.map((level) => (
                <div
                  key={level.level}
                  className="flex items-center justify-between rounded-2xl bg-white px-4 py-2 text-sm"
                >
                  <span className="font-semibold">{level.title}</span>
                  <span className="text-ink-soft">
                    {level.completedCount}/{level.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="mt-8 flex flex-wrap gap-3">
        {tabs.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          const locked = !unlocks[item.id];
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                active ? "bg-sunrise text-white" : "bg-sand-2 text-ink-soft"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              {locked && <Lock className="ml-1 h-4 w-4" />}
            </button>
          );
        })}
      </div>

      {tab === "build" && (
        <section className="mt-8 grid gap-6">
          {LIBRARY.buildCards.map((card) => {
            const isOpen = openBuildId === card.id;
            return (
              <article key={card.id} className="rounded-3xl bg-white p-6 shadow-card">
                <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
                  <div>
                    <img
                      src={MEDIA[card.media]?.src}
                      alt={MEDIA[card.media]?.alt}
                      className="h-52 w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                    <div className="mt-2 text-xs text-ink-soft">
                      {MEDIA[card.media]?.credit}
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-soft">
                      <span className="rounded-full bg-sand-2 px-2 py-1">{card.level}</span>
                      <span className="rounded-full bg-sand-2 px-2 py-1">{card.time}</span>
                      <span className="rounded-full bg-sand-2 px-2 py-1">{card.difficulty}</span>
                    </div>
                    <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">{card.title}</h2>
                    <p className="mt-2 text-lg text-ink-soft">{card.mission}</p>
                    <p className="mt-3 text-base text-ink-soft">
                      <strong className="text-ink">Goal:</strong> {card.goal}
                    </p>
                    <p className="mt-2 text-base text-ink-soft">
                      <strong className="text-ink">Challenge:</strong> {card.challenge}
                    </p>
                    <SourcePills sources={card.sources} />
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setOpenBuildId(isOpen ? null : card.id)}
                        className="rounded-full bg-sunrise px-4 py-2 text-sm font-semibold text-white"
                      >
                        {isOpen ? "Hide Build Plan" : "Open Build Plan"}
                      </button>
                      <a
                        className="text-sm font-semibold text-sky underline"
                        href={card.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open guide
                      </a>
                    </div>
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div className="rounded-2xl border border-sand-2 bg-sand/40 p-4">
                      <div className="text-sm font-semibold">Materials</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                        {card.materials.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-sand-2 bg-sand/40 p-4">
                      <div className="text-sm font-semibold">Steps</div>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
                        {card.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="rounded-2xl border border-sand-2 bg-white p-4">
                      <div className="text-sm font-semibold">Checkpoints</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                        {card.checkpoints.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl border border-sand-2 bg-white p-4">
                      <div className="text-sm font-semibold">Lesson Links</div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                        {card.connections.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      )}

      {tab === "practice" && (
        <section className="mt-8 grid gap-6">
          {unlocks.practice ? (
            LIBRARY.practiceDecks.map((deck) => (
              <PracticeDeck key={deck.title} deck={deck} />
            ))
          ) : (
            <div className="rounded-3xl border border-sand-2 bg-sand/50 p-6 text-center">
              <h3 className="text-xl font-semibold">Practice Decks Locked</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Finish all Level 1 lessons to unlock the decks.
              </p>
            </div>
          )}
        </section>
      )}

      {tab === "visual" && (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {unlocks.visual ? (
            LIBRARY.visualDeck.map((item) => (
              <article
                key={item.title}
                className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-card"
              >
                <img
                  src={MEDIA[item.media]?.src}
                  alt={MEDIA[item.media]?.alt}
                  className="absolute inset-0 h-full w-full object-cover opacity-35"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sky/40 via-slate-900/80 to-slate-950" />
                <div className="relative p-6">
                  <div className="text-xs font-semibold uppercase tracking-widest text-sun">
                    Blueprint
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">{item.title}</h2>
                  <p className="mt-1 text-sm text-slate-200">{item.subtitle}</p>
                  <p className="mt-3 text-sm text-slate-200">
                    Focus: {item.focus}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {item.callouts.map((callout) => (
                      <span
                        key={callout}
                        className="rounded-full border border-white/30 bg-white/10 px-2 py-1"
                      >
                        {callout}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 text-xs text-slate-200">
                    Lesson links: {item.connections.join(", ")}
                  </div>
                  <div className="mt-3 text-[11px] text-slate-300">
                    {MEDIA[item.media]?.credit}
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-sand-2 bg-sand/50 p-6 text-center">
              <h3 className="text-xl font-semibold">Blueprints Locked</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Finish all Level 2 lessons to unlock blueprints.
              </p>
            </div>
          )}
        </section>
      )}

      {tab === "notes" && (
        <section className="mt-8 grid gap-6 md:grid-cols-2">
          {unlocks.notes ? (
            LIBRARY.engineerNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-3xl bg-white p-6 shadow-card"
              >
                <div className="text-xs font-semibold uppercase tracking-widest text-sunrise">
                  {note.role}
                </div>
                <h2 className="mt-2 text-2xl font-semibold">{note.title}</h2>
                <div className="mt-3 space-y-3 text-sm text-ink-soft">
                  {note.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-4 rounded-2xl border border-sand-2 bg-sand/40 p-4">
                  <div className="text-sm font-semibold">Key Takeaways</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                    {note.takeaways.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <SourcePills sources={note.sources} />
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-sand-2 bg-sand/50 p-6 text-center">
              <h3 className="text-xl font-semibold">Engineer Notes Locked</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Finish all Level 3 lessons to unlock the notes.
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
