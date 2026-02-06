"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Nav from "../components/Nav";
import { BEYOND, LESSONS, LEVELS, MEDIA, SOURCES } from "../data/lessons";
import { Compass, Lock, Unlock, Sparkles, Hammer, Trophy } from "lucide-react";

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

export default function BeyondPage() {
  const [progress] = useStoredState(STORAGE_KEY, DEFAULT_PROGRESS);
  const [openProject, setOpenProject] = useState(null);

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

  const unlocked = levelStats.every(
    (level) => level.completedCount === level.total
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Nav />

      <header className="relative overflow-hidden rounded-3xl bg-white p-8 shadow-card">
        <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-sky/25 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-44 w-44 rounded-full bg-sun/30 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sand-2 px-3 py-1 text-sm font-semibold text-ink-soft">
              <Compass className="h-4 w-4" /> Beyond the Workshop
            </div>
            <h1 className="mt-4 font-title text-3xl font-semibold sm:text-4xl">
              {BEYOND.hero.title}
            </h1>
            <p className="mt-3 text-lg text-ink-soft">
              {BEYOND.hero.subtitle}
            </p>
            <p className="mt-2 text-sm text-ink-soft">{BEYOND.hero.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                  unlocked ? "bg-mint/20 text-ink" : "bg-sand-2 text-ink-soft"
                }`}
              >
                {unlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {unlocked ? "Quest Map Unlocked" : "Locked: Finish Levels 1-3"}
              </span>
              <Link
                href="/sources"
                className="rounded-full bg-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
              >
                Sources
              </Link>
            </div>
          </div>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-3xl border border-sand-2 bg-white">
              <img
                src={MEDIA[BEYOND.hero.media]?.src}
                alt={MEDIA[BEYOND.hero.media]?.alt}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="p-3 text-xs text-ink-soft">
                {MEDIA[BEYOND.hero.media]?.credit}
              </div>
            </div>
            <div className="rounded-3xl border border-sand-2 bg-sand/60 p-5">
              <div className="text-sm font-semibold text-ink">Quest Passport</div>
              <div className="mt-3 grid gap-2">
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
        </div>
      </header>

      <section className="mt-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Sparkles className="h-5 w-5 text-sunrise" /> Quest Map: Epic Engineering Feats
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Swipe through real engineering achievements and spot the ideas from the lessons.
        </p>
        <div className="relative mt-4">
          <div
            className={`flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory ${
              unlocked ? "" : "blur-sm"
            }`}
          >
            {BEYOND.feats.map((feat) => (
              <article
                key={feat.title}
                className="min-w-[260px] snap-center overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <img
                  src={MEDIA[feat.media]?.src}
                  alt={MEDIA[feat.media]?.alt}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="text-lg font-semibold">{feat.title}</div>
                  <p className="mt-2 text-sm text-ink-soft">{feat.text}</p>
                  <div className="mt-2 text-xs text-ink-soft">Focus: {feat.focus}</div>
                  <div className="mt-2 text-xs text-ink-soft">
                    Lesson links: {feat.connections.join(", ")}
                  </div>
                  <SourcePills sources={feat.sources} />
                  <div className="mt-2 text-[11px] text-ink-soft">
                    {MEDIA[feat.media]?.credit}
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!unlocked && (
            <div className="mt-4 rounded-2xl border border-sand-2 bg-sand/60 p-4 text-sm text-ink-soft">
              Finish all Level 1-3 lessons to unlock the full quest map.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Hammer className="h-5 w-5 text-sunrise" /> Mission Dock
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Bigger builds that connect to the core lessons. Open a mission plan to get started.
        </p>
        <div className={`mt-4 grid gap-6 lg:grid-cols-2 ${unlocked ? "" : "blur-sm"}`}>
          {BEYOND.projects.map((project) => {
            const isOpen = openProject === project.title;
            return (
              <article
                key={project.title}
                className="overflow-hidden rounded-3xl bg-white shadow-card"
              >
                <img
                  src={MEDIA[project.media]?.src}
                  alt={MEDIA[project.media]?.alt}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-lg font-semibold">{project.title}</div>
                      <div className="text-xs text-ink-soft">{project.level}</div>
                    </div>
                    <span className="rounded-full bg-sand-2 px-3 py-1 text-xs font-semibold text-ink-soft">
                      {project.time}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-ink-soft">{project.text}</p>
                  <p className="mt-2 text-sm text-ink-soft">
                    <strong className="text-ink">Goal:</strong> {project.goal}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setOpenProject(isOpen ? null : project.title)}
                      className="rounded-full bg-sunrise px-4 py-2 text-sm font-semibold text-white"
                    >
                      {isOpen ? "Hide Mission Plan" : "Open Mission Plan"}
                    </button>
                    <a
                      className="text-sm font-semibold text-sky underline"
                      href={project.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open guide
                    </a>
                  </div>
                  {isOpen && (
                    <div className="mt-4 rounded-2xl border border-sand-2 bg-sand/40 p-4">
                      <div className="text-sm font-semibold">Mission Steps</div>
                      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-soft">
                        {project.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      <div className="mt-3 text-xs text-ink-soft">
                        Lesson links: {project.connections.join(", ")}
                      </div>
                    </div>
                  )}
                  <SourcePills sources={project.sources} />
                  <div className="mt-2 text-[11px] text-ink-soft">
                    {MEDIA[project.media]?.credit}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Trophy className="h-5 w-5 text-sunrise" /> Bonus Vault
        </div>
        <p className="mt-2 text-sm text-ink-soft">
          Advanced builds for when Antoine wants a bigger challenge (adult supervision required).
        </p>
        <div className={`mt-4 grid gap-6 md:grid-cols-2 ${unlocked ? "" : "blur-sm"}`}>
          {BEYOND.bonus.map((project) => (
            <article
              key={project.title}
              className="overflow-hidden rounded-3xl bg-white shadow-card"
            >
              <img
                src={MEDIA[project.media]?.src}
                alt={MEDIA[project.media]?.alt}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
              <div className="p-5">
                <div className="text-lg font-semibold">{project.title}</div>
                <p className="mt-2 text-sm text-ink-soft">{project.text}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ink-soft">
                  <span>{project.level}</span>
                  <span>{project.time}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <a
                    className="text-sm font-semibold text-sky underline"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open guide
                  </a>
                </div>
                <SourcePills sources={project.sources} />
                <div className="mt-2 text-[11px] text-ink-soft">
                  {MEDIA[project.media]?.credit}
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-4 rounded-2xl border border-sunrise/30 bg-orange-50 p-4 text-sm text-ink-soft">
          Safety first: use soft projectiles only, never aim at people or animals, and follow local rules.
        </div>
      </section>

      {!unlocked && (
        <section className="mt-6 rounded-2xl border border-sand-2 bg-sand/60 p-4 text-sm text-ink-soft">
          Locked for now. Finish all Level 1-3 lessons to unlock the full quest map.
        </section>
      )}
    </main>
  );
}
