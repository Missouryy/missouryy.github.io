(() => {
  const a = document.querySelector('#score-a');
  if (!a) return;
  const b = document.querySelector('#score-b');
  const status = document.querySelector('#score-status');
  const undo = document.querySelector('#undo');
  const start = document.querySelector('#start-match');
  const clock = document.querySelector('#match-time');
  const buttons = [document.querySelector('#team-a'), document.querySelector('#team-b')];
  const names = ['梁伟铿 / 王昶', '金元浩 / 徐承宰'];
  const initial = () => ({ scores: [0, 0], server: 0, changed: false, interval: false });
  let state = initial();
  let history = [];
  let started = false;
  let elapsed = 0;
  let runningSince = null;
  let ticker = null;
  const won = (x, y) => (x >= 21 && x - y >= 2) || x >= 30;
  function finished() {
    const [x, y] = state.scores;
    return won(x, y) || won(y, x);
  }
  function updateClock() {
    const ms = elapsed + (runningSince === null ? 0 : performance.now() - runningSince);
    const seconds = Math.floor(ms / 1000);
    clock.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  }
  function resumeClock() {
    if (runningSince !== null) return;
    runningSince = performance.now();
    ticker = setInterval(updateClock, 250);
    updateClock();
  }
  function stopClock() {
    if (runningSince !== null) elapsed += performance.now() - runningSince;
    runningSince = null;
    clearInterval(ticker);
    ticker = null;
    updateClock();
  }
  function begin() {
    if (started) return;
    started = true;
    resumeClock();
    render();
  }
  function call() {
    const [x, y] = state.scores;
    if (finished()) {
      const winner = x > y ? 0 : 1;
      return `本局结束，${names[winner]}胜，${state.scores[winner]}比${state.scores[1 - winner]}`;
    }
    if (x === 0 && y === 0) return '0 比 0，比赛开始';
    const serving = state.scores[state.server];
    const receiving = state.scores[1 - state.server];
    let text = state.changed ? '换发球，' : '';
    text += serving === receiving ? `${serving} 平` : `${serving}比${receiving}`;
    if (state.interval) text += '，间歇';
    // Website uses score-then-status wording, including a receiver's game point.
    if (won(x + 1, y) || won(y + 1, x)) text += '，局点';
    return text;
  }
  function render() {
    const [x, y] = state.scores;
    a.textContent = x;
    b.textContent = y;
    const end = finished();
    start.hidden = started;
    status.hidden = !started;
    status.textContent = started ? call() : '';
    document.querySelector('#serve-a').textContent = !end && state.server === 0 ? '发球' : '';
    document.querySelector('#serve-b').textContent = !end && state.server === 1 ? '发球' : '';
    document.querySelector('#games-a').textContent = end && x > y ? '1' : '0';
    document.querySelector('#games-b').textContent = end && y > x ? '1' : '0';
    buttons.forEach(button => { button.disabled = end; });
    undo.disabled = history.length === 0;
  }
  start.addEventListener('click', () => {
    begin();
    buttons[state.server].focus({ preventScroll: true });
  });
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (finished()) return;
    begin();
    history.push({ ...state, scores: [...state.scores] });
    const previousMax = Math.max(...state.scores);
    state.changed = state.server !== index;
    state.scores[index] += 1;
    state.server = index;
    state.interval = previousMax < 11 && Math.max(...state.scores) === 11;
    if (finished()) stopClock();
    render();
  }));
  undo.addEventListener('click', () => {
    if (!history.length) return;
    const wasFinished = finished();
    state = history.pop();
    if (wasFinished) resumeClock();
    render();
  });
  document.querySelector('#reset').addEventListener('click', () => {
    stopClock();
    elapsed = 0;
    started = false;
    state = initial();
    history = [];
    updateClock();
    render();
  });
  document.addEventListener('visibilitychange', updateClock);
  render();
})();
