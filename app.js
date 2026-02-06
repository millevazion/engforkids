import { LESSONS, SOURCES, LEVELS, AI_PROMPTS } from "./data.js";

const STORAGE_KEY = "eng-quest-progress-v1";
const SETTINGS_KEY = "eng-quest-settings-v1";

const state = {
  activeLessonId: LESSONS[0].id,
  progress: loadProgress(),
  answers: {},
  quizChecked: {},
  settings: loadSettings(),
  aiText: {},
  aiImages: {},
  aiStatus: "idle",
};

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completed: {}, quiz: {} };
    return JSON.parse(raw);
  } catch (err) {
    return { completed: {}, quiz: {} };
  }
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.progress));
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return { apiKey: "", textModel: "gpt-4o-mini", imageModel: "gpt-image-1" };
    }
    return JSON.parse(raw);
  } catch (err) {
    return { apiKey: "", textModel: "gpt-4o-mini", imageModel: "gpt-image-1" };
  }
}

function saveSettings() {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.settings));
}

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

function getProgressStats() {
  const total = LESSONS.length;
  const completed = Object.keys(state.progress.completed).length;
  const percent = Math.round((completed / total) * 100);
  return { total, completed, percent };
}

function getLessonScore(lessonId) {
  const entry = state.progress.quiz[lessonId];
  if (!entry) return null;
  return entry;
}

function setActiveLesson(id) {
  state.activeLessonId = id;
  render();
}

function toggleLessonComplete(lessonId) {
  if (state.progress.completed[lessonId]) {
    delete state.progress.completed[lessonId];
  } else {
    state.progress.completed[lessonId] = true;
  }
  saveProgress();
  render();
}

function resetProgress() {
  state.progress = { completed: {}, quiz: {} };
  state.answers = {};
  state.quizChecked = {};
  saveProgress();
  render();
}

function selectAnswer(lessonId, questionIndex, answerIndex) {
  if (!state.answers[lessonId]) state.answers[lessonId] = [];
  state.answers[lessonId][questionIndex] = answerIndex;
  render();
}

function checkQuiz(lesson) {
  const answers = state.answers[lesson.id] || [];
  let correct = 0;
  lesson.quiz.forEach((q, i) => {
    if (answers[i] === q.answerIndex) correct += 1;
  });
  state.quizChecked[lesson.id] = true;
  state.progress.quiz[lesson.id] = {
    score: correct,
    total: lesson.quiz.length,
    timestamp: Date.now(),
  };
  if (lesson.quiz.length && correct / lesson.quiz.length >= 0.8) {
    state.progress.completed[lesson.id] = true;
  }
  saveProgress();
  render();
}

function resetQuiz(lessonId) {
  state.answers[lessonId] = [];
  state.quizChecked[lessonId] = false;
  delete state.progress.quiz[lessonId];
  saveProgress();
  render();
}

function updateSetting(key, value) {
  state.settings[key] = value;
  saveSettings();
  render();
}

function lessonPrompt(template, lesson) {
  return template.replace("{topic}", `${lesson.title} (${lesson.kicker})`);
}

async function generateText(lesson) {
  if (!state.settings.apiKey) {
    alert("Add an OpenAI API key in the AI Lab settings first.");
    return;
  }
  state.aiStatus = "loading";
  render();
  try {
    const prompt = lessonPrompt(AI_PROMPTS.idea, lesson);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.settings.apiKey}`,
      },
      body: JSON.stringify({
        model: state.settings.textModel,
        input: prompt,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Request failed");
    }
    const text = extractText(data);
    state.aiText[lesson.id] = text || "No text returned.";
  } catch (err) {
    state.aiText[lesson.id] = `Error: ${err.message}`;
  } finally {
    state.aiStatus = "idle";
    render();
  }
}

async function generateQuiz(lesson) {
  if (!state.settings.apiKey) {
    alert("Add an OpenAI API key in the AI Lab settings first.");
    return;
  }
  state.aiStatus = "loading";
  render();
  try {
    const prompt = lessonPrompt(AI_PROMPTS.quiz, lesson);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.settings.apiKey}`,
      },
      body: JSON.stringify({
        model: state.settings.textModel,
        input: prompt,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Request failed");
    }
    const text = extractText(data);
    state.aiText[lesson.id] = text || "No text returned.";
  } catch (err) {
    state.aiText[lesson.id] = `Error: ${err.message}`;
  } finally {
    state.aiStatus = "idle";
    render();
  }
}

async function generateImage(lesson) {
  if (!state.settings.apiKey) {
    alert("Add an OpenAI API key in the AI Lab settings first.");
    return;
  }
  state.aiStatus = "loading";
  render();
  try {
    const prompt = lessonPrompt(AI_PROMPTS.image, lesson);
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.settings.apiKey}`,
      },
      body: JSON.stringify({
        model: state.settings.imageModel,
        prompt,
        size: "1024x1024",
        quality: "low",
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Image request failed");
    }
    const images = (data.data || []).map((item) => item.b64_json).filter(Boolean);
    state.aiImages[lesson.id] = images;
  } catch (err) {
    state.aiText[lesson.id] = `Error: ${err.message}`;
  } finally {
    state.aiStatus = "idle";
    render();
  }
}

function extractText(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();
  if (!Array.isArray(data.output)) return "";
  const chunks = [];
  data.output.forEach((item) => {
    if (item.type === "message" && Array.isArray(item.content)) {
      item.content.forEach((part) => {
        if (part.type === "output_text" || part.type === "text") {
          chunks.push(part.text);
        }
      });
    }
  });
  return chunks.join("\n").trim();
}

function renderLessonList() {
  return LEVELS.map((level) => {
    const lessons = LESSONS.filter((lesson) => lesson.level === level.level);
    const items = lessons
      .map((lesson) => {
        const active = lesson.id === state.activeLessonId ? "active" : "";
        const isDone = state.progress.completed[lesson.id];
        return `
          <button class="lesson-button ${active}" data-lesson="${lesson.id}">
            ${lesson.title}
            <span>${lesson.kicker} ${isDone ? "• Done" : ""}</span>
          </button>
        `;
      })
      .join("");

    return `
      <div class="level-block">
        <div class="level-title">${level.title}</div>
        <div class="notice">${level.goal}</div>
        ${items}
      </div>
    `;
  }).join("");
}

function renderConcepts(lesson, sourceIndex) {
  return lesson.concepts
    .map((concept) => {
      const refs = concept.sources
        .map((id) => `<sup>[${sourceIndex.get(id)}]</sup>`)
        .join(" ");
      return `
        <div class="concept">
          <h4>${concept.title}</h4>
          <div>${concept.text} ${refs}</div>
        </div>
      `;
    })
    .join("");
}

function renderQuiz(lesson, sourceIndex) {
  const answers = state.answers[lesson.id] || [];
  const checked = !!state.quizChecked[lesson.id];
  return lesson.quiz
    .map((q, qi) => {
      const ref = q.sources
        .map((id) => `<sup>[${sourceIndex.get(id)}]</sup>`)
        .join(" ");
      const options = q.choices
        .map((choice, ci) => {
          let className = "";
          if (answers[qi] === ci) className = "selected";
          if (checked && answers[qi] === ci && ci === q.answerIndex)
            className = "correct";
          if (checked && answers[qi] === ci && ci !== q.answerIndex)
            className = "incorrect";
          return `
            <button class="${className}" data-question="${qi}" data-answer="${ci}">
              ${choice}
            </button>
          `;
        })
        .join("");

      const explanation = checked
        ? `<div class="notice">${q.explanation} ${ref}</div>`
        : "";

      return `
        <div class="quiz-question">
          <strong>${q.question}</strong>
          ${options}
          ${explanation}
        </div>
      `;
    })
    .join("");
}

function renderSources(lesson, sourceIds) {
  const rows = sourceIds
    .map((id, i) => {
      const source = SOURCES[id];
      if (!source) return "";
      return `<div>[${i + 1}] <a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a> — ${source.publisher}</div>`;
    })
    .join("");
  return rows;
}

function renderLessonVisual(lesson) {
  const color = ["#ff6b35", "#2ec4b6", "#ffd166"][lesson.level - 1] || "#ff6b35";
  return `
    <svg viewBox="0 0 300 140" role="img" aria-label="Lesson visual" style="width:100%; height:auto;">
      <rect x="12" y="18" width="276" height="104" rx="18" fill="#f7f7f7" stroke="#e2e2e2" />
      <circle cx="70" cy="70" r="26" fill="${color}" opacity="0.85" />
      <rect x="120" y="52" width="150" height="36" rx="18" fill="#fff" stroke="#d9d9d9" />
      <rect x="135" y="64" width="120" height="12" rx="6" fill="${color}" opacity="0.3" />
      <circle cx="210" cy="70" r="10" fill="${color}" />
      <path d="M35 105 L110 100" stroke="${color}" stroke-width="4" stroke-linecap="round" />
      <path d="M230 40 L260 30" stroke="${color}" stroke-width="4" stroke-linecap="round" />
    </svg>
  `;
}

function render() {
  const lesson = getLessonById(state.activeLessonId);
  const sourceIds = getLessonSources(lesson);
  const sourceIndex = buildSourceIndex(sourceIds);
  const stats = getProgressStats();
  const quizScore = getLessonScore(lesson.id);
  const aiText = state.aiText[lesson.id] || "";
  const aiImages = state.aiImages[lesson.id] || [];

  document.getElementById("app").innerHTML = `
    <section class="hero">
      <div>
        <div class="kicker">Engineering Quest</div>
        <h1>Build, Test, Improve — a mechanical engineering journey for Antoine.</h1>
        <p>
          Short lessons, hands-on challenges, and quizzes. Every fact is tied to a real source.
        </p>
        <div class="pill-row">
          <div class="pill">Progressive levels</div>
          <div class="pill">Kid-friendly visuals</div>
          <div class="pill">Quizzes + badges</div>
          <div class="pill">AI Lab (optional)</div>
        </div>
      </div>
      <div class="progress-card">
        <strong>Mission Progress</strong>
        <div class="progress-bar"><span style="width: ${stats.percent}%;"></span></div>
        <div>${stats.completed} of ${stats.total} lessons complete (${stats.percent}%).</div>
        <div class="actions">
          <button class="secondary" data-reset>Reset progress</button>
        </div>
        <div class="notice">Tip: Passing a quiz with 80%+ auto-completes a lesson.</div>
      </div>
    </section>

    <section class="main">
      <aside class="lesson-list">
        ${renderLessonList()}
      </aside>

      <section class="lesson-view">
        <div class="card">
          <div class="kicker">${lesson.kicker}</div>
          <h2>${lesson.title}</h2>
          <p>${lesson.summary}</p>
          ${renderLessonVisual(lesson)}
          <div class="actions" style="margin-top: 12px;">
            <button class="primary" data-complete>
              ${state.progress.completed[lesson.id] ? "Mark incomplete" : "Mark complete"}
            </button>
            <div class="badge">Level ${lesson.level}</div>
          </div>
        </div>

        <div class="card">
          <h3>Key Ideas</h3>
          <div class="grid-2">
            ${renderConcepts(lesson, sourceIndex)}
          </div>
        </div>

        <div class="card">
          <h3>Try It (Build Challenge)</h3>
          <ul class="try-it">
            ${lesson.tryIt.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>

        <div class="card">
          <h3>Mini Quiz</h3>
          <div class="quiz">${renderQuiz(lesson, sourceIndex)}</div>
          <div class="actions" style="margin-top: 12px;">
            <button class="primary" data-check>Check answers</button>
            <button class="secondary" data-reset-quiz>Reset quiz</button>
          </div>
          <div class="notice">
            ${
              quizScore
                ? `Latest score: ${quizScore.score}/${quizScore.total}.`
                : "No score yet."
            }
          </div>
        </div>

        <div class="card ai-panel">
          <h3>AI Lab (Optional)</h3>
          <div class="notice">
            Use with an adult. AI can help generate extra practice or diagrams, but it may make mistakes. Stick to the sourced content above for core learning.
          </div>
          <div class="notice">Your API key is stored locally in this browser.</div>
          <label>
            OpenAI API Key
            <input type="password" value="${state.settings.apiKey}" data-setting="apiKey" placeholder="sk-..." />
          </label>
          <label>
            Text model
            <input type="text" value="${state.settings.textModel}" data-setting="textModel" />
          </label>
          <label>
            Image model
            <input type="text" value="${state.settings.imageModel}" data-setting="imageModel" />
          </label>
          <div class="actions">
            <button class="primary" data-ai-text>Generate build challenges</button>
            <button class="secondary" data-ai-quiz>Generate practice questions</button>
            <button class="secondary" data-ai-image>Generate diagram</button>
          </div>
          <div class="ai-output">${state.aiStatus === "loading" ? "Working..." : aiText || "AI output will appear here."}</div>
          <div class="image-grid">
            ${aiImages
              .map((b64) => `<img src="data:image/png;base64,${b64}" alt="AI diagram" />`)
              .join("")}
          </div>
        </div>

        <div class="card">
          <h3>Sources for This Lesson</h3>
          <div class="sources">${renderSources(lesson, sourceIds)}</div>
        </div>
      </section>
    </section>

    <footer>
      Built for curious engineers. Keep safety in mind during experiments.
    </footer>
  `;

  bindEvents();
}

function bindEvents() {
  document.querySelectorAll(".lesson-button").forEach((btn) => {
    btn.addEventListener("click", () => setActiveLesson(btn.dataset.lesson));
  });

  const resetBtn = document.querySelector("[data-reset]");
  if (resetBtn) resetBtn.addEventListener("click", resetProgress);

  const completeBtn = document.querySelector("[data-complete]");
  if (completeBtn)
    completeBtn.addEventListener("click", () =>
      toggleLessonComplete(state.activeLessonId)
    );

  document.querySelectorAll(".quiz-question button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const questionIndex = Number(btn.dataset.question);
      const answerIndex = Number(btn.dataset.answer);
      selectAnswer(state.activeLessonId, questionIndex, answerIndex);
    });
  });

  const checkBtn = document.querySelector("[data-check]");
  if (checkBtn)
    checkBtn.addEventListener("click", () =>
      checkQuiz(getLessonById(state.activeLessonId))
    );

  const resetQuizBtn = document.querySelector("[data-reset-quiz]");
  if (resetQuizBtn)
    resetQuizBtn.addEventListener("click", () =>
      resetQuiz(state.activeLessonId)
    );

  document.querySelectorAll("[data-setting]").forEach((input) => {
    input.addEventListener("change", () =>
      updateSetting(input.dataset.setting, input.value.trim())
    );
  });

  const aiTextBtn = document.querySelector("[data-ai-text]");
  if (aiTextBtn)
    aiTextBtn.addEventListener("click", () =>
      generateText(getLessonById(state.activeLessonId))
    );

  const aiQuizBtn = document.querySelector("[data-ai-quiz]");
  if (aiQuizBtn)
    aiQuizBtn.addEventListener("click", () =>
      generateQuiz(getLessonById(state.activeLessonId))
    );

  const aiImageBtn = document.querySelector("[data-ai-image]");
  if (aiImageBtn)
    aiImageBtn.addEventListener("click", () =>
      generateImage(getLessonById(state.activeLessonId))
    );
}

render();
