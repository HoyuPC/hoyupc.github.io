const startDiv = document.getElementById("start");
const quizDiv = document.getElementById("quiz");
const endDiv = document.getElementById("end");

/** @type {HTMLInputElement} */
const yearRangeStartInput = document.getElementById("yearRangeStartInput");
/** @type {HTMLInputElement} */
const yearRangeEndInput = document.getElementById("yearRangeEndInput");
/** @type {HTMLInputElement} */
const challengeModeToggle = document.getElementById("challengeModeToggle");
/** @type {HTMLInputElement} */
const questionCountInput = document.getElementById("questionCountInput");
/** @type {HTMLButtonElement} */
const startButton = document.getElementById("startButton");

const progressText = document.getElementById("progress");
const container = document.getElementById("container");
const fakeContainer = document.getElementById("fakeContainer");
/** @type {HTMLButtonElement} */
const submitButton = document.getElementById("submitButton");
/** @type {HTMLButtonElement} */
const continueButton = document.getElementById("continueButton");

const challengeModeText = document.getElementById("challengeModeText");
const correctCountText = document.getElementById("correctCount");
const correctPercentageText = document.getElementById("correctPercentage");

/**
 * @typedef {{year: number, text: string}} HistoryEvent
 */

/**
 * @typedef {{challengeMode: boolean, count: number, minYear: number, maxYear: number}} QuizParams
 */

/**
 * @typedef {{root: HTMLElement, textElement: HTMLElement, yearElement: HTMLElement, event: HistoryEvent}} QuizElement
 */

/** @type {HistoryEvent[]} */
const historyEvents = [
  { year: 1946, text: "天皇の人間宣言" },
  { year: 1946, text: "極東軍事裁判の開廷" },
  { year: 1947, text: "日本国憲法の施行" },
  { year: 1951, text: "サンフランシスコ平和条約の締結" },
  { year: 1951, text: "（旧）日米安保条約の締結" },
  { year: 1954, text: "自衛隊の発足" },
  { year: 1956, text: "日ソ共同宣言" },
  { year: 1956, text: "日本が国際連合に加盟" },
  { year: 1960, text: "（新）日米安保条約が発効" },
  { year: 1964, text: "東海道新幹線の開業" },
  { year: 1965, text: "日韓基本条約の締結" },
  { year: 1970, text: "日本万国博覧会の開催" },
  { year: 1972, text: "札幌オリンピックの開催" },
  { year: 1972, text: "沖縄の返還" },
  { year: 1972, text: "日中共同声明の調印" },
  { year: 1978, text: "日中平和友好条約の締結" },
  { year: 1986, text: "男女雇用機会均等法の成立" },
  { year: 1989, text: "消費税の施行" },
  { year: 1995, text: "地下鉄サリン事件" },
  { year: 1998, text: "長野オリンピックの開催" },
  { year: 1999, text: "自公連立政権の発足" },
  { year: 2002, text: "初の日朝首脳会談" },
  { year: 2011, text: "LINEの運用開始" },
];

/** @type {HistoryEvent{}} */
const challengeModeHistoryEvents = [
  { year: 1946, text: "太宰治が「走れメロス」を出版" },
  { year: 1949, text: "労働組合法制定" },
  { year: 1952, text: "警察予備隊が保安隊に改組" },
  { year: 1953, text: "日本でテレビ放送が開始" },
  { year: 1953, text: "奄美群島の返還" },
  { year: 1954, text: "第五福竜丸事件" },
  { year: 1955, text: "イタイイタイ病の発生" },
  { year: 1955, text: "日本がGATTに加盟" },
  { year: 1958, text: "東京タワーが完成" },
  { year: 1960, text: "日本でカラーテレビ放送が開始" },
  { year: 1964, text: "公明党の結成" },
  { year: 1967, text: "公害対策基本法の制定" },
  { year: 1968, text: "東名高速道路が開業" },
  { year: 1968, text: "小笠原諸島の返還" },
  { year: 1969, text: "サザエさんが放送開始" },
  { year: 1971, text: "マクドナルド日本第1号店が開店" },
  { year: 1973, text: "変動相場制に移行" },
  { year: 1974, text: "佐藤栄作がノーベル賞を受賞" },
  { year: 1974, text: "セブンイレブン日本第1号店が開店" },
  { year: 1978, text: "成田空港が開港" },
  { year: 1982, text: "東北・上越新幹線の開業" },
  { year: 1983, text: "ファミリーコンピュータの発売" },
  { year: 1985, text: "日本航空123便墜落事故" },
  { year: 1987, text: "国鉄分割民営化" },
  { year: 1988, text: "青函トンネルが開業" },
  { year: 1988, text: "瀬戸大橋が開業" },
  { year: 1992, text: "PKO協力法の成立" },
  { year: 1993, text: "環境基本法の制定" },
  { year: 2005, text: "JR福知山線脱線事故" },
  { year: 2007, text: "国民投票法の成立" },
  { year: 2008, text: "iPhoneが日本で発売" },
  { year: 2009, text: "裁判員制度開始" },
  { year: 2011, text: "アナログ放送が放送終了" },
];

/** @type {HistoryEvent[]} */
const allHistoryEvents = [...historyEvents, ...challengeModeHistoryEvents];

function getEventPool(
  challengeMode = false,
  minYear = -Infinity,
  maxYear = Infinity,
) {
  return (challengeMode ? allHistoryEvents : historyEvents).filter(
    (event) => event.year >= minYear && event.year <= maxYear,
  );
}

let minYear = Math.min(...allHistoryEvents.map((e) => e.year));
let maxYear = Math.max(...allHistoryEvents.map((e) => e.year));

startDiv.hidden = false;
startButton.addEventListener("click", () => beginQuiz());
yearRangeStartInput.addEventListener("input", () => validateParams());
yearRangeEndInput.addEventListener("input", () => validateParams());
challengeModeToggle.addEventListener("input", () => validateParams());
questionCountInput.addEventListener("input", () => validateParams());

yearRangeStartInput.value = minYear;
yearRangeStartInput.min = minYear;
yearRangeStartInput.max = maxYear;
yearRangeEndInput.value = maxYear;
yearRangeEndInput.min = minYear;
yearRangeEndInput.max = maxYear;

let progress = 0;
let correctCount = 0;
/** @type {QuizParams} */
let params;

/** @type {QuizElement[]} */
let quizEventElements = [];
/** @type {QuizElement} */
let fakeQuizElement;

/** @type {QuizElement | undefined} */
let currentDraggingElement;
/** @type {number} */
let currentDraggingElementIndex;

function validateParams() {
  let isValid = validateParamInputs();
  startButton.disabled = !isValid;
}

/**
 * @returns {boolean}
 */
function validateParamInputs() {
  /**
   * @param {HTMLInputElement} input
   * @param {number} min
   * @param {number} max
   * @returns {boolean}
   */
  const validateNumber = (input, min = -Infinity, max = Infinity) => {
    let n = Number.parseInt(input.value);
    if (!Number.isInteger(n) || n < min || n > max) {
      return false;
    }
    return true;
  };

  if (!validateNumber(questionCountInput, 0, Infinity)) {
    return false;
  }
  if (!validateNumber(yearRangeStartInput, -Infinity, maxYear)) {
    return false;
  }
  if (!validateNumber(yearRangeEndInput, minYear, Infinity)) {
    return false;
  }
  if (yearRangeStartInput.valueAsNumber > yearRangeEndInput.valueAsNumber) {
    return false;
  }

  let eventPool = getEventPool(
    challengeModeToggle.checked,
    yearRangeStartInput.valueAsNumber,
    yearRangeEndInput.valueAsNumber,
  );
  let yearSet = new Set(eventPool.map((e) => e.year));
  if (yearSet.size < 4) return false;

  return true;
}

function beginQuiz() {
  if (!validateParamInputs()) return;

  params = {
    challengeMode: challengeModeToggle.checked,
    count: questionCountInput.valueAsNumber,
    minYear: yearRangeStartInput.valueAsNumber,
    maxYear: yearRangeEndInput.valueAsNumber,
  };

  progress = 0;
  correctCount = 0;
  nextQuestion();
}

submitButton.addEventListener("click", () => checkAnswers(true));
continueButton.addEventListener("click", () => nextQuestion());

function nextQuestion() {
  progress++;
  resetQuiz();

  if (progress > params.count) {
    showResults();
    return;
  }

  progressText.innerHTML = `${progress} / ${params.count}`;

  let pool = getEventPool(params.challengeMode, params.minYear, params.maxYear);
  /** @type {HistoryEvent[]} */
  let selectedEvents = [];
  for (let i = 0; i < 4; i++) {
    selectedEvents.push(selectHistoryEvent(pool, selectedEvents));
  }

  createEventElements(selectedEvents);
}

function resetQuiz() {
  startDiv.hidden = true;
  quizDiv.hidden = false;
  endDiv.hidden = true;

  submitButton.hidden = false;
  submitButton.disabled = false;
  continueButton.hidden = true;
  continueButton.disabled = true;

  quizEventElements.forEach((element) => element.root.remove());
  quizEventElements = [];
  if (fakeQuizElement) {
    fakeQuizElement.root.remove();
    fakeQuizElement = undefined;
  }

  currentDraggingElement = undefined;
  currentDraggingElementIndex = -1;
}

/**
 * @param {HistoryEvent[]} pool
 * @param {HistoryEvent[]} selectedEvents
 * @returns {HistoryEvent}
 */
function selectHistoryEvent(pool, selectedEvents) {
  /** @type {HistoryEvent} */
  let selectedEvent;

  do {
    selectedEvent = pool[Math.floor(Math.random() * pool.length)];
  } while (selectedEvents.some((other) => other.year == selectedEvent.year));

  return selectedEvent;
}

/**
 * @param {HistoryEvent[]} selectedEvents
 */
function createEventElements(selectedEvents) {
  /** @type {HTMLTemplateElement} */
  const template = document.getElementById("quiz-element");

  for (let event of selectedEvents) {
    const clone = document.importNode(template.content, true);

    let textElement = clone.querySelector(".text");
    let yearElement = clone.querySelector(".year");

    textElement.innerHTML = event.text;
    yearElement.innerHTML = event.year + "年";

    quizEventElements.push({
      root: clone.firstElementChild,
      textElement: textElement,
      yearElement: yearElement,
      event: event,
    });
    container.appendChild(clone);
  }

  const fakeClone = document.importNode(template.content, true);
  let fakeRoot = fakeClone.firstElementChild;
  fakeRoot.hidden = true;
  fakeQuizElement = {
    root: fakeRoot,
    textElement: fakeClone.querySelector(".text"),
    yearElement: fakeClone.querySelector(".year"),
    event: undefined,
  };
  fakeContainer.appendChild(fakeClone);

  for (let element of quizEventElements) {
    element.root.addEventListener("pointerdown", (e) =>
      onElementDragStart(e, element),
    );
  }
  document.addEventListener("pointermove", (e) =>
    onElementDragMove(e, currentDraggingElement),
  );

  document.addEventListener("pointerup", (e) =>
    onElementDragEnd(e, currentDraggingElement),
  );
}

/**
 * @param {PointerEvent} e
 * @param {QuizElement} element
 */
function onElementDragStart(e, element) {
  if (submitButton.disabled || submitButton.hidden) return;

  element.root.classList.add("dragging");
  fakeQuizElement.root.hidden = false;
  fakeQuizElement.textElement.innerHTML = element.textElement.innerHTML;
  currentDraggingElement = element;
  currentDraggingElementIndex = quizEventElements.indexOf(element);
  onElementDragMove(e, element);
  submitButton.disabled = true;
}

/**
 * @param {PointerEvent} e
 * @param {QuizElement | undefined} element
 */
function onElementDragMove(e, element) {
  if (!element) return;

  let containerRect = container.getBoundingClientRect();
  let originalRect = currentDraggingElement.root.getBoundingClientRect();

  let offsetX = e.pageX - containerRect.left - originalRect.width / 2;
  let offsetY = -originalRect.height - 8;

  fakeQuizElement.root.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  fakeQuizElement.root.style.width = originalRect.width + "px";
  fakeQuizElement.root.style.height = originalRect.height + "px";

  let newIndex = 0;
  for (let i = 1; i < quizEventElements.length; i++) {
    let element = quizEventElements[i];
    let elementRect = element.root.getBoundingClientRect();
    if (e.pageX > elementRect.x) {
      newIndex = i;
    }
  }

  if (newIndex != currentDraggingElementIndex) {
    let elementToReplace = quizEventElements[newIndex];
    quizEventElements[newIndex] = currentDraggingElement;
    quizEventElements[currentDraggingElementIndex] = elementToReplace;

    currentDraggingElementIndex = newIndex;

    for (let element of quizEventElements) {
      container.appendChild(element.root);
    }
  }
}

/**
 * @param {PointerEvent} e
 * @param {QuizElement | undefined} element
 */
function onElementDragEnd(e, element) {
  if (!element) return;

  element.root.classList.remove("dragging");
  fakeQuizElement.root.hidden = true;
  currentDraggingElement = undefined;
  submitButton.disabled = false;
}

/**
 * @param {boolean} forReal
 * @returns {boolean}
 */
function checkAnswers(forReal) {
  if (currentDraggingElement) return;

  let isCorrect = true;
  for (let i = 0; i < quizEventElements.length - 1; i++) {
    if (quizEventElements[i].event.year > quizEventElements[i + 1].event.year) {
      isCorrect = false;
      break;
    }
  }

  if (forReal) {
    submitButton.hidden = true;
    submitButton.disabled = true;
    continueButton.hidden = false;
    continueButton.disabled = false;

    if (isCorrect) correctCount++;
    quizEventElements.forEach((element) => {
      element.yearElement.hidden = false;
      element.yearElement.classList.add(isCorrect ? "correct" : "wrong");
    });
  }

  return isCorrect;
}

function showResults() {
  quizDiv.hidden = true;
  endDiv.hidden = false;

  challengeModeText.hidden = !params.challengeMode;
  correctCountText.innerHTML = `${correctCount} / ${params.count}`;
  correctPercentageText.innerHTML = `${Math.floor((correctCount / params.count) * 100)}%`;
}
