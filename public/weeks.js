// Weeks tab — 12 weeks grouped by phase. Tap a week to expand its 3 lessons.

function WeeksTab({ theme, curriculum, state, onOpenLesson }) {
  const [openWeek, setOpenWeek] = React.useState(null);
  const completed = new Set(state.completed || []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[6] }}>
      {curriculum.phases.map(phase => {
        const weeksInPhase = curriculum.weeks.filter(w => w.phaseId === phase.id);
        return (
          <div key={phase.id}>
            <div style={{
              fontFamily: theme.type.mono,
              fontSize: theme.fontSize.xs,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: theme.muted,
              marginBottom: theme.space[3],
              display: 'flex', alignItems: 'baseline', gap: theme.space[2],
            }}>
              <span>{phase.label}</span>
              <span style={{ opacity: 0.6 }}>weeks {phase.weekRange[0]}–{phase.weekRange[1]}</span>
            </div>
            <List theme={theme}>
              {weeksInPhase.map(week => {
                const done = week.lessons.filter(l => completed.has(l.id)).length;
                const total = week.lessons.length;
                const allDone = done === total;
                const isOpen = openWeek === week.number;

                return (
                  <React.Fragment key={week.number}>
                    <ListRow
                      theme={theme}
                      title={week.title}
                      sub={`Week ${week.number} · ${done} of ${total}`}
                      leading={
                        <WeekNumber theme={theme} n={week.number} highlight={allDone} />
                      }
                      trailing={
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: theme.space[2],
                        }}>
                          <div style={{ width: 64 }}>
                            <ProgressBar
                              theme={theme}
                              value={total ? done / total : 0}
                              tone={allDone ? 'ok' : 'cool'}
                              height={4}
                            />
                          </div>
                          <span style={{ color: theme.muted, display: 'inline-flex' }}>
                            {isOpen
                              ? UI_ICONS.ChevronUp(undefined, 16)
                              : UI_ICONS.ChevronDown(undefined, 16)}
                          </span>
                        </span>
                      }
                      onClick={() => setOpenWeek(isOpen ? null : week.number)}
                    />
                    {isOpen && (
                      <div className="lai-fadein" style={{
                        background: theme.cardElev,
                        padding: `${theme.space[2]}px ${theme.space[3]}px ${theme.space[3]}px`,
                        borderBottom: `1px solid ${theme.borderSubtle}`,
                      }}>
                        {week.lessons.map(lesson => {
                          const ldone = completed.has(lesson.id);
                          return (
                            <button
                              key={lesson.id}
                              className="ak-btn"
                              onClick={() => onOpenLesson(lesson, week)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: theme.space[3],
                                width: '100%', textAlign: 'left',
                                padding: `${theme.space[2]}px ${theme.space[3]}px`,
                                background: 'transparent',
                                border: 'none',
                                borderRadius: theme.radius.md,
                                color: theme.fg,
                                minHeight: theme.density.hitTarget,
                              }}
                            >
                              <TypeBadge theme={theme} type={lesson.type} />
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: theme.fontSize.sm,
                                  color: theme.fg,
                                  fontWeight: 500,
                                  textDecoration: ldone ? 'line-through' : 'none',
                                  opacity: ldone ? 0.6 : 1,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}>{lesson.title}</div>
                                <div style={{
                                  fontFamily: theme.type.mono,
                                  fontSize: theme.fontSize.xs,
                                  color: theme.muted,
                                  marginTop: 2,
                                }}>{lesson.duration}</div>
                              </div>
                              {ldone && <CheckMark color={theme.ok} />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </List>
          </div>
        );
      })}
    </div>
  );
}

function WeekNumber({ theme, n, highlight }) {
  return (
    <span style={{
      width: 32, height: 32, borderRadius: '50%',
      background: highlight ? theme.ok : theme.card,
      border: `1px solid ${highlight ? theme.ok : theme.border}`,
      color: highlight ? theme.inkOnWarm : theme.fg,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: theme.type.mono, fontSize: theme.fontSize.sm, fontWeight: 600,
      flexShrink: 0,
    }}>{n}</span>
  );
}

function CheckMark({ color = 'currentColor', size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

window.WeeksTab = WeeksTab;
window.CheckMark = CheckMark;
