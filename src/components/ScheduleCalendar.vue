<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  dataPath: string;
  displayWeekCount?: number;
}>();

const data = ref<CalendarData>();
const state = ref<State>('loading');
const errorReason = ref<any>();
const container = ref<HTMLElement>();
const table = ref<HTMLTableElement>();

type State = 'loading' | 'error' | 'ready';

type CalendarData = {
  highlightDays: Day[] | undefined;
  months: Month[];
};

type Month = {
  month: [number, number];
  events: Event[] | undefined;
  schedule: Schedule | undefined;
};

type Event = {
  date: number;
  type: 'schoolEvent' | 'schoolExam' | 'schoolHoliday' | 'holiday' | undefined;
  text: string;
};

type Schedule = {
  [index: number]: boolean | [boolean, string];
};

type Day = 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat';
const daysOfWeek: Day[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayNames: { [Property in Day]: string } = {
  Sun: '日',
  Mon: '月',
  Tue: '火',
  Wed: '水',
  Thu: '木',
  Fri: '金',
  Sat: '土',
};

function error(reason: any) {
  state.value = 'error';
  errorReason.value = reason;
}

onMounted(() => {
  fetch(props.dataPath)
    .then((response) => {
      response
        .text()
        .then((text) => {
          data.value = JSON.parse(text) as CalendarData;
          processData();
        })
        .catch((reason) => error(reason));
    })
    .catch((reason) => error(reason));

  addEventListener('resize', () => resizeTable());
});

onUnmounted(() => {
  removeEventListener('resize', () => resizeTable());
});

function processData() {
  data.value?.months.forEach((monthInfo) => {
    let year = monthInfo.month[0];
    let month = monthInfo.month[1];
    if (monthInfo.events) {
      monthInfo.events.forEach((e) => {
        getOrCreateDayInfo(year, month, e.date).events.push(e);
      });
    }
    if (monthInfo.schedule) {
      Object.entries(monthInfo.schedule).forEach((dayInfo) => {
        let day = Number.parseInt(dayInfo[0], 10);
        getOrCreateDayInfo(year, month, day).active = dayInfo[1];
      });
    }
  });

  const today = new Date(Date.now());
  today.setHours(0, 0, 0, 0);
  let todayDayOfWeek = today.getDay();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - todayDayOfWeek);

  let days = 0;
  let targetDay = new Date(thisWeekStart);
  for (let i = 0; i < (props.displayWeekCount ?? 4); i++) {
    let week: DayInfo[] = Array(7);
    for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
      week[dayOfWeek] = getOrCreateDayInfo(targetDay.getFullYear(), targetDay.getMonth() + 1, targetDay.getDate());
      targetDay.setDate(targetDay.getDate() + 1);
      days++;
    }

    displayWeeks.value.push(week);

    if (days > 300) break;
  }

  state.value = 'ready';

  nextTick().then(() => resizeTable());
}

function resizeTable() {
  if (state.value !== 'ready') return;

  let targetWidth = document.querySelector('.tab-view')!.clientWidth;
  let currentWidth = table.value!.clientWidth;
  if (targetWidth < currentWidth) {
    table.value!.style.transform = `scale(${targetWidth / currentWidth})`;
    container.value!.style.height = '' + table.value!.clientHeight * (targetWidth / currentWidth) + 'px';
  } else {
    table.value!.style.transform = '';
    container.value!.style.height = '';
  }
  table.value!.classList.remove('preparing');
}

function getOrCreateDayInfo(year: number, month: number, day: number): DayInfo {
  let key = JSON.stringify([year, month, day]);
  if (days.value.has(key)) {
    return days.value.get(key)!;
  } else {
    let newValue: DayInfo = {
      date: [year, month, day],
      dayOfWeek: daysOfWeek[new Date(year, month - 1, day).getDay()],
      hasDataForMonth: data.value!.months.some((m) => m.month[0] === year && m.month[1] === month),
      active: false,
      events: [],
    };
    days.value.set(key, newValue);
    return newValue;
  }
}

type DayInfo = {
  date: [number, number, number];
  dayOfWeek: Day;
  hasDataForMonth: boolean;
  active: boolean | [boolean, string];
  events: Event[];
};

const days = ref<Map<string, DayInfo>>(new Map());
const displayWeeks = ref<(DayInfo | undefined)[][]>([]);

function getClassForDay(day: Day): string[] | undefined {
  if ((data.value?.highlightDays ?? []).includes(day)) {
    return ['header-highlight'];
  } else if (day === 'Sun') {
    return ['header-highlight', 'holiday'];
  } else if (day === 'Sat') {
    return ['header-highlight', 'saturday'];
  }
}

function getClassForDayInfo(day: DayInfo): string[] | undefined {
  let arr: string[] = [];
  if (day.dayOfWeek === 'Sun' || day.events.some((e) => e.type === 'holiday')) {
    arr = ['highlight', 'holiday'];
  } else if (day.dayOfWeek === 'Sat') {
    arr = ['highlight', 'saturday'];
  }

  const today = new Date(Date.now());
  if (day.date[0] === today.getFullYear() && day.date[1] === today.getMonth() + 1 && day.date[2] === today.getDate()) {
    if (!arr.includes('highlight')) arr.push('highlight');
    arr.push('today');
  }

  return arr;
}

function getDayLabelText(weekIndex: number, dayIndex: number, day: DayInfo): string {
  return (weekIndex === 0 && dayIndex === 0) || day.date[2] === 1 ? `${day.date[1]}/${day.date[2]}` : `${day.date[2]}`;
}

function isActive(day: DayInfo): boolean {
  return typeof day.active === 'boolean' ? day.active : day.active[0];
}
</script>

<template>
  <p class="status-text" v-if="state === 'loading'">読み込み中...</p>
  <p class="info-box error" v-if="state === 'error'">{{ errorReason }}</p>
  <p v-if="state === 'ready' && !displayWeeks.length">データなし</p>

  <div class="main" ref="container" v-if="state === 'ready' && displayWeeks.length">
    <table class="preparing" ref="table">
      <thead>
        <tr class="header-row">
          <th v-for="(value, key) in dayNames" class="day-header" :class="getClassForDay(key)" scope="col">
            {{ value }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in displayWeeks">
          <th
            class="day"
            v-for="(day, dayIndex) in week as DayInfo[]"
            :class="!day.hasDataForMonth ? 'missing-data' : undefined"
          >
            <span class="day-label" :class="getClassForDayInfo(day)">{{
              getDayLabelText(weekIndex, dayIndex, day)
            }}</span>
            <span v-if="!isActive(day) && day.events[0]">{{ day.events[0].text }}</span>
            <span
              v-if="
                day.hasDataForMonth &&
                ((data!.highlightDays?.includes(day.dayOfWeek) && !day.events[0]) || isActive(day))
              "
              :class="Array.isArray(day.active) ? 'tooltip-container' : undefined"
            >
              <span
                :class="[Array.isArray(day.active) ? 'hover-me' : undefined, isActive(day) ? 'active' : 'inactive']"
                :aria-haspopup="Array.isArray(day.active)"
                :tabindex="Array.isArray(day.active) ? 0 : undefined"
              >
                {{ isActive(day) }}
              </span>
              <span v-if="Array.isArray(day.active)" class="tooltip-contents">{{ day.active[1] }}</span>
            </span>
          </th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="css">
.status-text {
  text-align: center;
}

.main {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 32px;
}

table {
  border-spacing: 0;
  border: 2px solid var(--black-1);
  transform-origin: top center;
}

table.preparing {
  visibility: hidden;
  opacity: 0;
}

table th {
  border: 1px solid var(--black-1);
}

.header-row th {
  border-bottom: 2px solid var(--black-1);
  height: 40px;
}

table tr {
  display: flex;
}

.header-highlight,
.highlight {
  color: green;

  &.saturday {
    color: blue;
  }
  &.holiday {
    color: red;
  }
  &.today {
    font-weight: 700;
  }
}

.missing-data {
  background-color: var(--color-5);
}

.tooltip-container {
  position: relative;
}

.hover-me {
  text-decoration: underline dotted var(--black-1) 2px !important;

  @media (hover: hover) and (pointer: fine) {
    &:is(:hover, :focus, :active) + .tooltip-contents {
      visibility: visible;
      opacity: 1;
    }
  }
}

.tooltip-contents {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  transform-origin: top center;
  min-width: 130px;
  padding: 8px;
  border-radius: 4px;
  background-color: var(--black-1);
  color: var(--color-6);
  visibility: hidden;
  opacity: 0;
  transition: all 200ms;
  z-index: 1;

  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 99%;
    left: 50%;
    border-style: solid;
    border-width: 8px 8px 0 8px;
    border-color: black transparent transparent transparent;
    transform: translateX(-50%);
    pointer-events: none;
  }
}

.active,
.inactive {
  display: block;
  width: 40px;
  aspect-ratio: 1 / 1;
  color: transparent;
  user-select: none;
}

.active {
  background-color: red;
  clip-path: path('M20 0 A20 20 0 1 1 20 40 A20 20 0 1 1 20 0 Z M20 2 A18 18 0 1 0 20 38 A18 18 0 1 0 20 2 Z');
  clip-rule: evenodd;
}

.day,
.day-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 80px;
}

.day {
  position: relative;
}

.day-label {
  position: absolute;
  top: 0;
  left: 2px;
}
</style>
