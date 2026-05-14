// Today tab — current week banner, next up to 3 incomplete lessons, streak stat.

function TodayTab({ theme, curriculum, state, onOpenLesson, accentColor }) {
  const completed = new Set(state.completed || []);
  const totalLessons = curriculum.weeks.reduce((n, w) => n + w.lessons.length, 0);
  const doneCount = state.completed?.length || 0;

  // Current week = lowest-numbered week with any incomplete lesson.
  const currentWeek =
    curriculum.weeks.find(w => w.lessons.some(l => !completed.has(l.id)))
    || curriculum.weeks[curriculum.weeks.length - 1];

  // Next 3 incomplete lessons across the whole curriculum (in order).
  const nextUp = [];
  for (const w of curriculum.weeks) {
    for (const l of w.lessons) {
      if (!completed.has(l.id)) nextUp.push({ week: w, lesson: l });
      if (nextUp.length === 3) break;
    }
    if (nextUp.length === 3) break;
  }

  const streak = state.streak?.count || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[5] }}>
      {/* Header row: streak + counts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.space[3], flexWrap: 'wrap' }}>
        <StreakChip theme={theme} count={streak} accent={accentColor} />
        <Tag theme={theme} tone="muted">
          {doneCount} / {totalLessons} done
        </Tag>
      </div>

      {/* Current week banner */}
      <Card theme={theme} tone="elev" style={{ borderColor: accentColor }}>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: 4,
        }}>
          Week {currentWeek.number} · this week
        </div>
        <div style={{
          fontFamily: theme.type.serif,
          fontSize: theme.fontSize.lg,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: theme.fg,
          lineHeight: 1.15,
          marginBottom: theme.space[2],
        }}>
          {currentWeek.title}
        </div>
        <div style={{
          fontSize: theme.fontSize.sm,
          color: theme.muted,
          lineHeight: 1.45,
        }}>
          {currentWeek.desc}
        </div>
      </Card>

      {/* Next up */}
      <div>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[3],
        }}>
          Next up
        </div>
        {nextUp.length === 0 ? (
          <EmptyState
            theme={theme}
            title="All twelve weeks done"
            sub="Both of you finished the curriculum. Pick a lesson again to revisit, or invent your own project."
          />
        ) : (
          <List theme={theme}>
            {nextUp.map(({ week, lesson }) => (
              <ListRow
                key={lesson.id}
                theme={theme}
                title={lesson.title}
                sub={`Week ${week.number} · ${lesson.duration}`}
                leading={<TypeBadge theme={theme} type={lesson.type} />}
                trailing={
                  <span style={{
                    fontFamily: theme.type.mono,
                    fontSize: theme.fontSize.xs,
                    color: theme.muted,
                  }}>open</span>
                }
                onClick={() => onOpenLesson(lesson, week)}
              />
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

// Small streak chip — flame-shape SVG (no emoji).
function StreakChip({ theme, count, accent }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: `4px ${theme.space[2]}px`,
      background: theme.card,
      border: `1px solid ${theme.border}`,
      borderRadius: theme.radius.pill,
      fontFamily: theme.type.mono,
      fontSize: theme.fontSize.xs,
      color: theme.fg,
      letterSpacing: '0.04em',
    }}>
      <FlameIcon color={count > 0 ? (accent || theme.warm) : theme.muted} size={14} />
      {count} day{count === 1 ? '' : 's'}
    </span>
  );
}

function FlameIcon({ color = 'currentColor', size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 1-5 0 1 1 2 2 2 0-3 0-4 1-6z" />
      <path d="M7 14c0 3.5 2.5 6 5 6s5-2.5 5-6" />
    </svg>
  );
}

function TypeBadge({ theme, type }) {
  // Type tag colors per the brief: lesson = cool/blue-purple, quiz = warn/amber,
  // project = ok/green. Use kit tones to stay theme-aware.
  const map = {
    lesson:  { tone: 'cool',  label: 'L' },
    quiz:    { tone: 'warn',  label: 'Q' },
    project: { tone: 'ok',    label: 'P' },
  };
  const m = map[type] || map.lesson;
  const c = { cool: theme.cool, warn: theme.warn, ok: theme.ok }[m.tone];
  return (
    <span style={{
      width: 28, height: 28, borderRadius: theme.radius.md,
      background: `color-mix(in oklch, ${c} 16%, ${theme.card})`,
      border: `1px solid color-mix(in oklch, ${c} 50%, ${theme.border})`,
      color: c,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme.type.mono,
      fontSize: theme.fontSize.sm,
      fontWeight: 600,
      flexShrink: 0,
    }}>{m.label}</span>
  );
}

window.TodayTab = TodayTab;
window.TypeBadge = TypeBadge;
window.StreakChip = StreakChip;
window.FlameIcon = FlameIcon;
