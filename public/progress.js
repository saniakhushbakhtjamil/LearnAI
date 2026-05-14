// Progress tab — 12-row grid of 3 cells per week, plus summary stats.

function ProgressTab({ theme, curriculum, state, accentColor, partnerState, partnerName, partnerAccent }) {
  const completed = new Set(state.completed || []);
  const partnerCompleted = partnerState ? new Set(partnerState.completed || []) : new Set();
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

  // Current user's display name
  const myName = state.user?.display_name || 'You';

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
        {/* Grid header: title + dot legend */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.space[3],
          flexWrap: 'wrap',
          gap: theme.space[2],
        }}>
          <div style={{
            fontFamily: theme.type.mono,
            fontSize: theme.fontSize.xs,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: theme.muted,
          }}>The grid</div>

          {/* Dot legend — pairs of colored dots + names */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: theme.space[4],
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 8, height: 8, borderRadius: '50%', background: accentColor, flexShrink: 0,
              }} />
              <span style={{
                fontFamily: theme.type.mono, fontSize: theme.fontSize.xs, color: theme.muted,
              }}>{myName}</span>
            </div>
            {partnerState && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', background: partnerAccent, flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: theme.type.mono, fontSize: theme.fontSize.xs, color: theme.muted,
                }}>{partnerName}</span>
              </div>
            )}
          </div>
        </div>

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
                    partnerDone={partnerState ? partnerCompleted.has(lesson.id) : null}
                    partnerAccent={partnerAccent}
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

function ProgressCell({ theme, lesson, done, accent, partnerDone, partnerAccent }) {
  const typeMap = {
    lesson:  { tone: theme.cool,  short: 'L' },
    quiz:    { tone: theme.warn,  short: 'Q' },
    project: { tone: theme.ok,    short: 'P' },
  };
  const m = typeMap[lesson.type] || typeMap.lesson;

  // Build tooltip
  const doneLabel = done ? ' · you: done' : '';
  const partnerLabel = partnerDone !== null
    ? (partnerDone ? ' · partner: done' : '')
    : '';
  const tooltipText = `${lesson.title}${doneLabel}${partnerLabel}`;

  // Background tint: use current user's accent if done, partner's accent if only partner done
  const bgColor = done
    ? `color-mix(in oklch, ${m.tone} 38%, ${theme.card})`
    : theme.card;
  const borderColor = done ? m.tone : theme.borderSubtle;

  return (
    <div
      title={tooltipText}
      style={{
        height: 36,
        borderRadius: theme.radius.sm,
        background: bgColor,
        border: `1px solid ${borderColor}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `0 ${theme.space[2]}px`,
        color: done ? m.tone : theme.muted,
        fontFamily: theme.type.mono,
        fontSize: theme.fontSize.xs,
        fontWeight: 600,
        transition: theme.motion.fast,
      }}
    >
      <span>{m.short}</span>
      {/* Two small dots: left = current user, right = partner */}
      {partnerDone !== null && (
        <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: done ? accent : theme.borderSubtle,
            transition: theme.motion.fast,
          }} />
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: partnerDone ? partnerAccent : theme.borderSubtle,
            transition: theme.motion.fast,
          }} />
        </span>
      )}
    </div>
  );
}

window.ProgressTab = ProgressTab;
