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
  Lock,
  Unlock,
  Star,
  Compass,
  Sparkles,
  Zap,
  Cpu,
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

function EngineerAvatar({ stage }) {
  return (
    <svg viewBox="0 0 160 180" className="h-24 w-24">
      <circle cx="80" cy="80" r="70" fill={stage.glow} />
      <rect x="42" y="92" width="76" height="62" rx="22" fill={stage.suit} />
      <rect x="54" y="104" width="52" height="32" rx="14" fill={stage.shirt} />
      <circle cx="80" cy="66" r="26" fill={stage.skin} />
      <rect x="48" y="36" width="64" height="24" rx="12" fill={stage.helmet} />
      <rect x="42" y="52" width="76" height="12" rx="6" fill={stage.helmetTrim} />
      <rect x="56" y="62" width="48" height="18" rx="9" fill={stage.goggles} />
      <circle cx="68" cy="70" r="4" fill="#111827" />
      <circle cx="92" cy="70" r="4" fill="#111827" />
      <rect x="70" y="126" width="20" height="18" rx="6" fill={stage.badge} />
      <rect x="124" y="108" width="10" height="40" rx="5" fill={stage.tool} />
      <circle cx="129" cy="104" r="8" fill="none" stroke={stage.tool} strokeWidth="4" />
    </svg>
  );
}

function ProgressRing({ percent, colorClass }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg viewBox="0 0 72 72" className="h-16 w-16">
      <circle
        cx="36"
        cy="36"
        r="26"
        fill="none"
        strokeWidth="8"
        className="stroke-sand-2"
      />
      <circle
        cx="36"
        cy="36"
        r="26"
        fill="none"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
        className={`${colorClass} transition-all duration-700`}
      />
    </svg>
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
  const selectedAnswers = answers[lesson.id] || [];
  const quizCheckedForLesson = quizChecked[lesson.id];
  const scorePercent = quizScore
    ? Math.round((quizScore.score / quizScore.total) * 100)
    : 0;
  const quizCount = Object.keys(progress.quiz || {}).length;
  const xp = stats.completed * 50 + quizCount * 20;
  const rank =
    xp >= 800
      ? "Master Builder"
      : xp >= 550
      ? "Gear Hero"
      : xp >= 300
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
    {
      id: "power",
      title: "Power Pilot",
      detail: "Finish Level 4",
      unlocked: levelStats[3]?.completedCount === levelStats[3]?.total,
      color: "bg-sunrise",
    },
    {
      id: "systems",
      title: "System Architect",
      detail: "Finish Level 5",
      unlocked: levelStats[4]?.completedCount === levelStats[4]?.total,
      color: "bg-sun",
    },
  ];

  const completedLevels = levelStats.filter(
    (level) => level.completedCount === level.total
  ).length;
  const badgeCount = badges.filter((badge) => badge.unlocked).length;
  const avatarStages = [
    {
      name: "Rookie Engineer",
      blurb: "Learning the basics.",
      helmet: "#ffd166",
      helmetTrim: "#f59e0b",
      goggles: "#111827",
      suit: "#ff6b35",
      shirt: "#ffe8c7",
      badge: "#f59e0b",
      skin: "#f8d7c0",
      tool: "#111827",
      glow: "#fff3d4",
    },
    {
      name: "Field Builder",
      blurb: "Ready for hands-on builds.",
      helmet: "#5b7cfa",
      helmetTrim: "#1d4ed8",
      goggles: "#111827",
      suit: "#ff6b35",
      shirt: "#ffd166",
      badge: "#2ec4b6",
      skin: "#f8d7c0",
      tool: "#1d4ed8",
      glow: "#e6ecff",
    },
    {
      name: "Machine Tinkerer",
      blurb: "Simple machines unlocked.",
      helmet: "#2ec4b6",
      helmetTrim: "#0f766e",
      goggles: "#f8fafc",
      suit: "#111827",
      shirt: "#ffd166",
      badge: "#ff6b35",
      skin: "#f8d7c0",
      tool: "#0f766e",
      glow: "#dff7f4",
    },
    {
      name: "Motion Architect",
      blurb: "Movement systems engaged.",
      helmet: "#111827",
      helmetTrim: "#334155",
      goggles: "#f8fafc",
      suit: "#5b7cfa",
      shirt: "#ffd166",
      badge: "#2ec4b6",
      skin: "#f8d7c0",
      tool: "#334155",
      glow: "#e6ecff",
    },
    {
      name: "Power Strategist",
      blurb: "Energy and power mastered.",
      helmet: "#ff6b35",
      helmetTrim: "#b45309",
      goggles: "#f8fafc",
      suit: "#1f2937",
      shirt: "#5b7cfa",
      badge: "#ffd166",
      skin: "#f8d7c0",
      tool: "#b45309",
      glow: "#ffe7d7",
    },
    {
      name: "System Architect",
      blurb: "Complex systems unlocked.",
      helmet: "#2ec4b6",
      helmetTrim: "#0f766e",
      goggles: "#f8fafc",
      suit: "#0f172a",
      shirt: "#ff6b35",
      badge: "#5b7cfa",
      skin: "#f8d7c0",
      tool: "#0f766e",
      glow: "#dff7f4",
    },
  ];
  const avatarStage = avatarStages[Math.min(completedLevels, avatarStages.length - 1)];

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
              Build, Test, Improve — a mechanical engineering journey for curious kids.
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
            <div className="mt-4 flex items-center gap-4 rounded-xl bg-sand/60 p-3">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white">
                <EngineerAvatar stage={avatarStage} />
              </div>
              <div>
                <div className="text-sm font-semibold">{avatarStage.name}</div>
                <div className="text-xs text-ink-soft">{avatarStage.blurb}</div>
                <div className="mt-2 text-xs font-semibold text-ink-soft">
                  Badges earned: {badgeCount}/{badges.length}
                </div>
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

      <section className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {levelStats.map((level) => {
          const styleMap = {
            1: {
              icon: Rocket,
              color: "text-sunrise",
              ring: "stroke-sunrise",
              bg: "bg-sun/30",
              tag: "bg-sunrise/10 text-sunrise",
            },
            2: {
              icon: Wrench,
              color: "text-mint",
              ring: "stroke-mint",
              bg: "bg-mint/15",
              tag: "bg-mint/15 text-mint",
            },
            3: {
              icon: Sparkles,
              color: "text-sky",
              ring: "stroke-sky",
              bg: "bg-sky/15",
              tag: "bg-sky/15 text-sky",
            },
            4: {
              icon: Zap,
              color: "text-sunrise",
              ring: "stroke-sunrise",
              bg: "bg-sunrise/10",
              tag: "bg-sunrise/10 text-sunrise",
            },
            5: {
              icon: Cpu,
              color: "text-ink",
              ring: "stroke-ink",
              bg: "bg-sand-2",
              tag: "bg-sand-2 text-ink-soft",
            },
          };

          const style = styleMap[level.level] || styleMap[1];
          const Icon = style.icon;

          return (
            <div
              key={level.level}
              className="group rounded-2xl bg-white p-4 shadow-card transition hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(15,23,42,0.15)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${style.tag}`}
                  >
                    Level {level.level}
                  </span>
                  <div className="text-sm font-semibold">{level.title}</div>
                  <div className="text-xs text-ink-soft">{level.goal}</div>
                </div>
                <div className="relative flex h-16 w-16 items-center justify-center">
                  <ProgressRing percent={level.percent} colorClass={style.ring} />
                  <div className={`absolute inset-0 flex items-center justify-center rounded-full ${style.bg} floaty`}>
                    <Icon className={`h-6 w-6 ${style.color}`} />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
                <span>
                  {level.completedCount} of {level.total} complete
                </span>
                <span className="font-semibold">{level.percent}%</span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-card">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-soft">
          <Trophy className="h-4 w-4 text-sunrise" /> Badge Shelf
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                  progress.completed?.[lesson.id]
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-sand-2 text-ink-soft"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {progress.completed?.[lesson.id]
                  ? "Lesson complete"
                  : "Complete the quiz (80%+)"}
              </span>
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
                  {concept.example && (
                    <p className="mt-2 text-xs text-ink-soft">
                      {concept.example}
                    </p>
                  )}
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
                const checked = quizCheckedForLesson;
                return (
                  <div
                    key={q.question}
                    className="rounded-xl border border-sand-2 bg-sand/60 p-4"
                  >
                    <div className="text-sm font-semibold">{q.question}</div>
                    <div className="mt-3 grid gap-2">
                      {q.choices.map((choice, ci) => {
                        const isSelected = selectedAnswers[qi] === ci;
                        const isCorrect = checked && ci === q.answerIndex;
                        const isWrong = checked && isSelected && ci !== q.answerIndex;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleSelectAnswer(qi, ci)}
                            disabled={checked}
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
                            <span className="flex items-center justify-between gap-2">
                              <span>{choice}</span>
                              {checked && isSelected && (
                                <span className="rounded-full bg-sand-2 px-2 py-0.5 text-[11px] font-semibold text-ink-soft">
                                  Your choice
                                </span>
                              )}
                              {checked && isCorrect && (
                                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                  Correct
                                </span>
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {checked && (
                      <div className="mt-3 text-xs text-ink-soft">
                        <p>
                          Your answer:{" "}
                          <span className="font-semibold text-ink">
                            {selectedAnswers[qi] === undefined
                              ? "No answer"
                              : q.choices[selectedAnswers[qi]]}
                          </span>
                        </p>
                        <p>
                          Correct answer:{" "}
                          <span className="font-semibold text-ink">
                            {q.choices[q.answerIndex]}
                          </span>
                        </p>
                        <p className="mt-2">
                          {q.explanation}{" "}
                          <SourceRefs sources={q.sources} index={sourceIndex} />
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {quizCheckedForLesson && quizScore && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm">
                You got <strong>{quizScore.score}</strong> out of{" "}
                <strong>{quizScore.total}</strong> correct ({scorePercent}%).
              </div>
            )}
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
                : "Complete all Level 1-5 lessons to unlock the quest map."}
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
