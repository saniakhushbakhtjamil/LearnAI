// Progress tab — 12-row grid of 3 cells per week, plus summary stats.

function ProgressTab({ theme, curriculum, state, accentColor }) {
  const completed = new Set(state.completed || []);
  const quizzes = state.quizzes || {};

  const totalLessons = curriculum.weeks.reduce((n, w) => n + w.lessons.length, 0);
  const doneCount = state.completed?.length || 0;
  const pct = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0;

  const quizAttempts = Object.values(quizzes);
  const quizCorrect = quizAttempts.filter(q => q.correct).length;
  const quizPct = quizAttempts.length
    ? Math.round((quizCorrect / quizAttempts.length) * 100)
    : 0;

  const notesCount = Object.values(state.notes || {}).reduce(
    (n, perLesson) => n + Object.values(perLesson).filter(b => (b || '').trim()).length, 0,
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[5] }}>
      <Card theme={theme} tone="elev">
        <KeyValueGrid
          theme={theme}
          columns={3}
          items={[
            { k: 'Lessons', v: `${doneCount} / ${totalLessons} · ${pct}%` },
            { k: 'Quizzes', v: quizAttempts.length
                ? `${quizCorrect} / ${quizAttempts.length} · ${quizPct}%`
                : '—' },
            { k: 'Notes', v: String(notesCount) },
          ]}
        />
        <div style={{ marginTop: theme.space[3] }}>
          <ProgressBar
            theme={theme}
            value={totalLessons ? doneCount / totalLessons : 0}
            tone="cool"
            height={6}
          />
        </div>
      </Card>

      <Card theme={theme}>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[3],
        }}>The grid</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[2] }}>
          {curriculum.weeks.map(week => (
            <div key={week.number} style={{
              display: 'flex', alignItems: 'center', gap: theme.space[3],
            }}>
              <span style={{
                width: 28, textAlign: 'right',
                fontFamily: theme.type.mono,
                fontSize: theme.fontSize.xs,
                color: theme.muted,
              }}>W{week.number}</span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: theme.space[2],
                flex: 1,
              }}>
                {week.lessons.map(lesson => (
                  <ProgressCell
                    key={lesson.id}
                    theme={theme}
                    lesson={lesson}
                    done={completed.has(lesson.id)}
                    accent={accentColor}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card theme={theme}>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[2],
        }}>Streak</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.space[3] }}>
          <StreakChip theme={theme} count={state.streak?.count || 0} accent={accentColor} />
          <span style={{
            fontSize: theme.fontSize.sm, color: theme.muted,
          }}>
            {state.streak?.last_date
              ? `last completion: ${state.streak.last_date}`
              : 'no streak yet — finish a lesson today to start one'}
          </span>
        </div>
      </Card>
    </div>
  );
}

function ProgressCell({ theme, lesson, done, accent }) {
  const typeMap = {
    lesson:  { tone: theme.cool,  short: 'L' },
    quiz:    { tone: theme.warn,  short: 'Q' },
    project: { tone: theme.ok,    short: 'P' },
  };
  const m = typeMap[lesson.type] || typeMap.lesson;
  return (
    <div
      title={`${lesson.title}${done ? ' · done' : ''}`}
      style={{
        height: 36,
        borderRadius: theme.radius.sm,
        background: done
          ? `color-mix(in oklch, ${m.tone} 38%, ${theme.card})`
          : theme.card,
        border: `1px solid ${done ? m.tone : theme.borderSubtle}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: done ? m.tone : theme.muted,
        fontFamily: theme.type.mono,
        fontSize: theme.fontSize.xs,
        fontWeight: 600,
        transition: theme.motion.fast,
      }}
    >{m.short}</div>
  );
}

window.ProgressTab = ProgressTab;
