"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { LESSONS, LEVELS, SOURCES, MEDIA } from "./data/lessons";
import Nav from "./components/Nav";
import {
  BookOpenCheck,
  Wrench,
  Rocket,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  ShieldCheck,
  Trophy,
  MapPinned,
  Lock,
  Unlock,
  Star,
  Compass,
} from "lucide-react";

const STORAGE_KEY = "eng-quest-progress-v2";
const DEFAULT_PROGRESS = { completed: {}, quiz: {} };

function getLessonById(id) {
  return LESSONS.find((lesson) => lesson.id === id) || LESSONS[0];
}

function getLessonSources(lesson) {
  const ids = new Set();
  lesson.concepts.forEach((concept) => concept.sources.forEach((id) => ids.add(id)));
  lesson.quiz.forEach((q) => q.sources.forEach((id) => ids.add(id)));
  return Array.from(ids);
}

function buildSourceIndex(sourceIds) {
  const index = new Map();
  sourceIds.forEach((id, i) => index.set(id, i + 1));
  return index;
}

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

function SourceRefs({ sources, index }) {
  if (!sources?.length) return null;
  return (
    <>
      {sources.map((id) => (
        <sup key={id} className="text-xs text-sky">
          [{index.get(id)}]
        </sup>
      ))}
    </>
  );
}

export default function Home() {
  const [activeLessonId, setActiveLessonId] = useState(LESSONS[0].id);
  const [progress, setProgress] = useStoredState(STORAGE_KEY, DEFAULT_PROGRESS);
  const [answers, setAnswers] = useState({});
  const [quizChecked, setQuizChecked] = useState({});

  const lesson = useMemo(() => getLessonById(activeLessonId), [activeLessonId]);
  const sourceIds = useMemo(() => getLessonSources(lesson), [lesson]);
  const sourceIndex = useMemo(() => buildSourceIndex(sourceIds), [sourceIds]);

  const stats = useMemo(() => {
    const total = LESSONS.length;
    const completed = Object.keys(progress.completed || {}).length;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [progress]);

  const levelStats = useMemo(() => {
    return LEVELS.map((level) => {
      const lessons = LESSONS.filter((item) => item.level === level.level);
      const completedCount = lessons.filter((item) => progress.completed?.[item.id])
        .length;
      const percent = Math.round((completedCount / lessons.length) * 100);
      return {
        ...level,
        total: lessons.length,
        completedCount,
        percent,
      };
    });
  }, [progress]);

  const allCoreComplete = levelStats.every(
    (level) => level.completedCount === level.total
  );

  const quizScore = progress.quiz?.[lesson.id] || null;
  const quizCount = Object.keys(progress.quiz || {}).length;
  const xp = stats.completed * 50 + quizCount * 20;
  const rank =
    xp >= 450
      ? "Master Builder"
      : xp >= 250
      ? "Gear Hero"
      : xp >= 120
      ? "Curious Apprentice"
      : "Rookie Engineer";

  const badges = [
    {
      id: "foundations",
      title: "Force Finder",
      detail: "Finish Level 1",
      unlocked: levelStats[0]?.completedCount === levelStats[0]?.total,
      color: "bg-sun",
    },
    {
      id: "machines",
      title: "Machine Master",
      detail: "Finish Level 2",
      unlocked: levelStats[1]?.completedCount === levelStats[1]?.total,
      color: "bg-mint",
    },
    {
      id: "motion",
      title: "Motion Maker",
      detail: "Finish Level 3",
      unlocked: levelStats[2]?.completedCount === levelStats[2]?.total,
      color: "bg-sky",
    },
  ];

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    setAnswers((prev) => {
      const lessonAnswers = [...(prev[lesson.id] || [])];
      lessonAnswers[questionIndex] = answerIndex;
      return { ...prev, [lesson.id]: lessonAnswers };
    });
  };

  const handleCheckQuiz = () => {
    const lessonAnswers = answers[lesson.id] || [];
    let correct = 0;
    lesson.quiz.forEach((q, index) => {
      if (lessonAnswers[index] === q.answerIndex) correct += 1;
    });

    setQuizChecked((prev) => ({ ...prev, [lesson.id]: true }));
    setProgress((prev) => {
      const updated = {
        ...prev,
        quiz: {
          ...prev.quiz,
          [lesson.id]: {
            score: correct,
            total: lesson.quiz.length,
            timestamp: Date.now(),
          },
        },
      };

      if (lesson.quiz.length && correct / lesson.quiz.length >= 0.8) {
        updated.completed = { ...updated.completed, [lesson.id]: true };
      }

      return updated;
    });
  };

  const handleResetQuiz = () => {
    setAnswers((prev) => ({ ...prev, [lesson.id]: [] }));
    setQuizChecked((prev) => ({ ...prev, [lesson.id]: false }));
    setProgress((prev) => {
      const next = { ...prev, quiz: { ...prev.quiz } };
      delete next.quiz[lesson.id];
      return next;
    });
  };

  const handleToggleComplete = () => {
    setProgress((prev) => {
      const next = { ...prev, completed: { ...prev.completed } };
      if (next.completed[lesson.id]) delete next.completed[lesson.id];
      else next.completed[lesson.id] = true;
      return next;
    });
  };

  const handleResetProgress = () => {
    setProgress(DEFAULT_PROGRESS);
    setAnswers({});
    setQuizChecked({});
  };

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Nav />

      <section className="relative overflow-hidden rounded-3xl bg-white/90 p-6 shadow-card backdrop-blur">
        <div className="absolute -right-20 -top-10 h-40 w-40 rounded-full bg-sun/40 blur-2xl" />
        <div className="absolute -left-16 bottom-0 h-32 w-32 rounded-full bg-mint/40 blur-2xl" />

        <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sand-2 px-3 py-1 text-sm font-semibold text-ink-soft">
              <Rocket className="h-4 w-4" /> Engineering Quest
            </div>
            <h1 className="mt-4 font-title text-3xl font-semibold sm:text-4xl">
              Build, Test, Improve — a mechanical engineering journey for Antoine.
            </h1>
            <p className="mt-3 text-base leading-relaxed text-ink-soft">
              Short lessons, hands-on challenges, and quizzes. Every fact is tied to a real source.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Progressive levels",
                "Kid-friendly visuals",
                "Quizzes + badges",
                "Hands-on rewards",
              ].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full bg-sand-2 px-3 py-1 text-sm font-semibold text-ink-soft"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <strong className="text-base">Mission Progress</strong>
              <ShieldCheck className="h-5 w-5 text-mint" />
            </div>
            <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-sand-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sunrise to-mint"
                style={{ width: `${stats.percent}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-ink-soft">
              {stats.completed} of {stats.total} lessons complete ({stats.percent}%).
            </div>
            <div className="mt-4 grid gap-2 rounded-xl bg-sand/60 p-3">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>XP</span>
                <span className="text-sunrise">{xp}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Rank</span>
                <span className="text-ink-soft">{rank}</span>
              </div>
            </div>
            <button
              onClick={handleResetProgress}
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sand-2 px-3 py-2 text-sm font-semibold text-ink-soft hover:border-sunrise hover:text-ink"
            >
              <RotateCcw className="h-4 w-4" /> Reset progress
            </button>
            <p className="mt-3 text-xs text-ink-soft">
              Tip: Passing a quiz with 80%+ auto-completes a lesson.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {levelStats.map((level) => (
          <div key={level.level} className="rounded-2xl bg-white p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                  {level.title}
                </div>
                <div className="text-xs text-ink-soft">{level.goal}</div>
              </div>
              <MapPinned className="h-5 w-5 text-sunrise" />
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-sand-2">
              <div
                className="h-full rounded-full bg-gradient-to-r from-sunrise to-sky"
                style={{ width: `${level.percent}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-ink-soft">
              {level.completedCount} of {level.total} complete
            </div>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <Trophy className="h-4 w-4 text-sunrise" /> Badge Shelf
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-xl border p-3 transition ${
                badge.unlocked
                  ? "border-transparent bg-sand/60 shadow-card"
                  : "border-sand-2 bg-white opacity-60"
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full ${
                    badge.color
                  } ${badge.unlocked ? "" : "grayscale"}`}
                >
                  {badge.unlocked ? (
                    <Star className="h-4 w-4" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                </span>
                <div>
                  <div className="text-sm font-semibold">{badge.title}</div>
                  <div className="text-xs text-ink-soft">{badge.detail}</div>
                </div>
              </div>
              <div className="mt-2 text-xs text-ink-soft">
                {badge.unlocked ? "Unlocked!" : "Locked — complete the level."}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl bg-white p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
            <BookOpenCheck className="h-4 w-4" /> Mission Map
          </div>
          <div className="mt-4 grid gap-6">
            {LEVELS.map((level) => {
              const lessons = LESSONS.filter((item) => item.level === level.level);
              return (
                <div key={level.level} className="grid gap-2">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-soft">
                    {level.title}
                  </div>
                  <div className="text-xs text-ink-soft">{level.goal}</div>
                  <div className="grid gap-2">
                    {lessons.map((item) => {
                      const isActive = item.id === lesson.id;
                      const isDone = progress.completed?.[item.id];
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveLessonId(item.id)}
                          className={`group flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                            isActive
                              ? "border-sunrise bg-orange-50"
                              : "border-transparent bg-sand-2 hover:border-sunrise/50"
                          }`}
                        >
                          <span>
                            {item.title}
                            <span className="block text-xs font-normal text-ink-soft">
                              {item.kicker} {isDone ? "• Done" : ""}
                            </span>
                          </span>
                          <ChevronRight className={`h-4 w-4 ${isActive ? "text-sunrise" : "text-ink-soft"}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <section className="grid gap-6">
          <div className="rounded-2xl bg-white p-6 shadow-card">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky">
              {lesson.kicker}
            </div>
            <h2 className="mt-2 font-title text-2xl font-semibold sm:text-3xl">
              {lesson.title}
            </h2>
            <p className="mt-2 text-base text-ink-soft">{lesson.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={handleToggleComplete}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                  progress.completed?.[lesson.id]
                    ? "bg-emerald-500"
                    : "bg-sunrise"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {progress.completed?.[lesson.id] ? "Completed!" : "Mark complete"}
              </button>
              <span className="inline-flex items-center gap-2 rounded-full bg-sand-2 px-3 py-1 text-xs font-semibold text-ink-soft">
                <Wrench className="h-4 w-4" /> Level {lesson.level}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold">Key Ideas</h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {lesson.concepts.map((concept) => (
                <div
                  key={concept.title}
                  className="rounded-xl border border-sand-2 bg-sand/60 p-4"
                >
                  <div className="text-base font-semibold">{concept.title}</div>
                  <p className="mt-2 text-sm text-ink-soft">
                    {concept.text} <SourceRefs sources={concept.sources} index={sourceIndex} />
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold">Try It (Build Challenge)</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-soft">
              {lesson.tryIt.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold">Mini Quiz</h3>
            <div className="mt-4 grid gap-4">
              {lesson.quiz.map((q, qi) => {
                const selected = answers[lesson.id] || [];
                const checked = quizChecked[lesson.id];
                return (
                  <div
                    key={q.question}
                    className="rounded-xl border border-sand-2 bg-sand/60 p-4"
                  >
                    <div className="text-sm font-semibold">{q.question}</div>
                    <div className="mt-3 grid gap-2">
                      {q.choices.map((choice, ci) => {
                        const isSelected = selected[qi] === ci;
                        const isCorrect = checked && ci === q.answerIndex;
                        const isWrong = checked && isSelected && ci !== q.answerIndex;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelectAnswer(qi, ci)}
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                              isCorrect
                                ? "border-emerald-500 bg-emerald-50"
                                : isWrong
                                ? "border-rose-500 bg-rose-50"
                                : isSelected
                                ? "border-sunrise bg-orange-50"
                                : "border-white bg-white hover:border-sunrise/50"
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                    {checked && (
                      <p className="mt-3 text-xs text-ink-soft">
                        {q.explanation} <SourceRefs sources={q.sources} index={sourceIndex} />
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleCheckQuiz}
                className="rounded-lg bg-sunrise px-4 py-2 text-sm font-semibold text-white"
              >
                Check answers
              </button>
              <button
                onClick={handleResetQuiz}
                className="rounded-lg border border-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
              >
                Reset quiz
              </button>
            </div>
            <p className="mt-3 text-xs text-ink-soft">
              {quizScore
                ? `Latest score: ${quizScore.score}/${quizScore.total}.`
                : "No score yet."}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-card">
            <h3 className="text-lg font-semibold">Sources for This Lesson</h3>
            <div className="mt-3 grid gap-2 text-sm text-ink-soft">
              {sourceIds.map((id, index) => {
                const source = SOURCES[id];
                if (!source) return null;
                return (
                  <div key={id}>
                    [{index + 1}] <a className="text-sky underline" href={source.url} target="_blank" rel="noreferrer">{source.title}</a> — {source.publisher}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </section>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <img
            src={MEDIA.marbleRun.src}
            alt={MEDIA.marbleRun.alt}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <div className="text-sm font-semibold text-sunrise">Artifact Library</div>
            <h3 className="mt-2 text-xl font-semibold">Build cards, practice decks, and visual blueprints.</h3>
            <p className="mt-2 text-sm text-ink-soft">
              Explore structured missions with materials, steps, and lesson links. Open anytime.
            </p>
            <Link
              href="/library"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-sunrise px-4 py-2 text-sm font-semibold text-white"
            >
              Open the Library
            </Link>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <img
            src={MEDIA.iss.src}
            alt={MEDIA.iss.alt}
            className="h-44 w-full object-cover"
            loading="lazy"
          />
          <div className="p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-sky">
              <Compass className="h-4 w-4" /> Beyond the Workshop
            </div>
            <h3 className="mt-2 text-xl font-semibold">Epic engineering feats + advanced missions.</h3>
            <p className="mt-2 text-sm text-ink-soft">
              {allCoreComplete
                ? "Unlocked! Explore the quest map and advanced builds."
                : "Complete all Level 1-3 lessons to unlock the quest map."}
            </p>
            <Link
              href="/beyond"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-sand-2 px-4 py-2 text-sm font-semibold text-ink-soft"
            >
              {allCoreComplete ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              View the Quest Map
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-10 text-center text-xs text-ink-soft">
        Built for curious engineers. Keep safety in mind during experiments.
      </footer>
    </main>
  );
}
