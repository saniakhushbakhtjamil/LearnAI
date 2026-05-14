// Learn AI together — root component.
// Wires user picker, four tabs, lesson detail overlay, and every API call.

ensureKitStyles();

// Accent colors for each user (purple = Sania, teal = Björn) — applied to
// bottom-bar active state, streak chip, and the today card border.
const USER_ACCENTS = {
  s: 'oklch(0.7 0.18 305)',  // purple
  b: 'oklch(0.72 0.115 200)', // teal
};

const STORAGE_USER  = 'learnUser';
const STORAGE_THEME = 'learnTheme';

function App() {
  const [palette, setPalette] = React.useState(() =>
    localStorage.getItem(STORAGE_THEME) || 'dark');
  const theme = React.useMemo(() => buildTheme(palette, 'calm'), [palette]);

  const [userId, setUserId] = React.useState(() =>
    localStorage.getItem(STORAGE_USER) || null);
  const [curriculum, setCurriculum] = React.useState(null);
  const [state, setState] = React.useState(null);
  const [tab, setTab] = React.useState('today');
  const [openLesson, setOpenLesson] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  // Initial + on-user-change load
  React.useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      fetch('/api/curriculum').then(r => r.json()),
      fetch(`/api/state?user=${userId}`).then(r => r.json()),
    ])
      .then(([c, s]) => { setCurriculum(c); setState(s); })
      .catch(e => setError(e.message || 'load failed'))
      .finally(() => setLoading(false));
  }, [userId]);

  function handlePickUser(uid) {
    localStorage.setItem(STORAGE_USER, uid);
    setUserId(uid);
  }
  function handleSwitchUser(uid) {
    localStorage.setItem(STORAGE_USER, uid);
    setUserId(uid);
    setOpenLesson(null);
    setTab('today');
  }
  function handleSwitchPalette(p) {
    localStorage.setItem(STORAGE_THEME, p);
    setPalette(p);
  }

  // ─── API actions ──────────────────────────────────────────────────────
  function refreshState() {
    return fetch(`/api/state?user=${userId}`)
      .then(r => r.json())
      .then(setState);
  }

  function markComplete(lessonId) {
    return fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userId, lesson_id: lessonId }),
    })
      .then(r => r.json())
      .then(() => refreshState())
      .then(() => setOpenLesson(null));
  }

  function answerQuiz(lessonId, selected, correct) {
    // Optimistic local state — server only stores first attempt anyway.
    setState(s => ({
      ...s,
      quizzes: {
        ...s.quizzes,
        [lessonId]: s.quizzes[lessonId] || {
          selected, correct, at: Math.floor(Date.now() / 1000),
        },
      },
    }));
    return fetch('/api/quiz', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: userId, lesson_id: lessonId, selected, correct }),
    });
  }

  function saveNote(lessonId, idx, body) {
    // Optimistic local set so re-renders during typing keep the value.
    setState(s => ({
      ...s,
      notes: {
        ...s.notes,
        [lessonId]: { ...(s.notes[lessonId] || {}), [idx]: body },
      },
    }));
    return fetch('/api/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userId, lesson_id: lessonId, concept_idx: idx, body,
      }),
    });
  }

  // ─── First-run user picker ────────────────────────────────────────────
  if (!userId) {
    return (
      <Surface theme={theme}>
        <UserPicker theme={theme} onSelect={handlePickUser} />
      </Surface>
    );
  }

  // ─── Loading / error ──────────────────────────────────────────────────
  if (loading || !curriculum || !state) {
    return (
      <Surface theme={theme}>
        <div style={{
          minHeight: '100dvh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {error ? (
            <Alert theme={theme} tone="err" title="Couldn't load" message={error} />
          ) : <Spinner theme={theme} size={28} />}
        </div>
      </Surface>
    );
  }

  const accentColor = USER_ACCENTS[userId] || theme.warm;
  const user = state.user;

  const nav = [
    { id: 'today',    label: 'Today',    icon: UI_ICONS.Sparkle(undefined, 22),
      active: tab === 'today',    onClick: () => { setOpenLesson(null); setTab('today'); } },
    { id: 'weeks',    label: 'Weeks',    icon: UI_ICONS.ListLines(undefined, 22),
      active: tab === 'weeks',    onClick: () => { setOpenLesson(null); setTab('weeks'); } },
    { id: 'progress', label: 'Progress', icon: UI_ICONS.BarChart(undefined, 22),
      active: tab === 'progress', onClick: () => { setOpenLesson(null); setTab('progress'); } },
    { id: 'you',      label: 'You',      icon: UI_ICONS.Settings(undefined, 22),
      active: tab === 'you',      onClick: () => { setOpenLesson(null); setTab('you'); } },
  ];

  const headerBar = (
    <React.Fragment>
      <div style={{
        flex: 1, minWidth: 0,
        fontFamily: theme.type.serif,
        fontSize: theme.fontSize.md,
        fontWeight: 500,
        letterSpacing: '-0.02em',
        color: theme.fg,
      }}>learn ai together</div>
      <StreakChip theme={theme} count={state.streak?.count || 0} accent={accentColor} />
      <span
        title={user.display_name}
        style={{
          width: 28, height: 28, borderRadius: 14,
          background: accentColor,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: theme.inkOnWarm,
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          fontWeight: 600,
        }}
      >{(user.display_name || '?').charAt(0)}</span>
    </React.Fragment>
  );

  return (
    <Surface theme={theme} style={{ minHeight: '100dvh', background: theme.dustBg }}>
      <AppShell
        theme={theme}
        nav={nav}
        topBar={headerBar}
      >
        <div className="lai-fadein" style={{ maxWidth: 720, margin: '0 auto', width: '100%' }}>
          {openLesson ? (
            <LessonDetail
              theme={theme}
              user={user}
              lesson={openLesson.lesson}
              week={openLesson.week}
              state={state}
              onClose={() => setOpenLesson(null)}
              onComplete={markComplete}
              onQuizAnswer={answerQuiz}
              onSaveNote={saveNote}
            />
          ) : (
            <React.Fragment>
              {tab === 'today' && (
                <TodayTab
                  theme={theme}
                  curriculum={curriculum}
                  state={state}
                  accentColor={accentColor}
                  onOpenLesson={(lesson, week) => setOpenLesson({ lesson, week })}
                />
              )}
              {tab === 'weeks' && (
                <WeeksTab
                  theme={theme}
                  curriculum={curriculum}
                  state={state}
                  onOpenLesson={(lesson, week) => setOpenLesson({ lesson, week })}
                />
              )}
              {tab === 'progress' && (
                <ProgressTab
                  theme={theme}
                  curriculum={curriculum}
                  state={state}
                  accentColor={accentColor}
                />
              )}
              {tab === 'you' && (
                <YouTab
                  theme={theme}
                  user={user}
                  palette={palette}
                  onSwitchUser={handleSwitchUser}
                  onSwitchPalette={handleSwitchPalette}
                />
              )}
            </React.Fragment>
          )}
        </div>
      </AppShell>
    </Surface>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
