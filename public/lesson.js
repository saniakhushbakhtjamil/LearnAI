// Lesson detail overlay — opens INSIDE the active tab as a full-tab swap.
// Three sub-views via SegmentedControl: Learn / Quiz / Build.

function LessonDetail({
  theme, user, lesson, week,
  state, onClose, onComplete, onQuizAnswer, onSaveNote,
}) {
  const [tab, setTab] = React.useState('learn');
  const isDone = (state.completed || []).includes(lesson.id);
  const quizAttempt = state.quizzes?.[lesson.id];

  return (
    <div className="lai-slideup" style={{
      display: 'flex', flexDirection: 'column',
      gap: theme.space[4],
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: theme.space[3],
      }}>
        <Button theme={theme} variant="ghost" size="sm" onClick={onClose}>
          {UI_ICONS.ChevronUp(undefined, 14)}
          back
        </Button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: theme.type.mono,
            fontSize: theme.fontSize.xs,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: theme.muted,
            marginBottom: 2,
          }}>
            Week {week.number} · {lesson.duration}
          </div>
          <div style={{
            fontFamily: theme.type.serif,
            fontSize: theme.fontSize.lg,
            fontWeight: 500,
            color: theme.fg,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}>{lesson.title}</div>
          {lesson.sub && (
            <div style={{
              fontSize: theme.fontSize.sm,
              color: theme.muted,
              marginTop: 4,
            }}>{lesson.sub}</div>
          )}
        </div>
      </div>

      {/* Sub-tabs */}
      <div>
        <SegmentedControl
          theme={theme}
          value={tab}
          onChange={setTab}
          options={[
            { value: 'learn', label: 'Learn' },
            { value: 'quiz',  label: 'Quiz' },
            { value: 'build', label: 'Build' },
          ]}
        />
      </div>

      {/* Body */}
      {tab === 'learn' && (
        <LearnView
          theme={theme}
          lesson={lesson}
          notes={state.notes?.[lesson.id] || {}}
          onSaveNote={(idx, body) => onSaveNote(lesson.id, idx, body)}
        />
      )}
      {tab === 'quiz' && (
        <QuizView
          theme={theme}
          lesson={lesson}
          attempt={quizAttempt}
          onAnswer={(selected, correct) => onQuizAnswer(lesson.id, selected, correct)}
        />
      )}
      {tab === 'build' && (
        <BuildView theme={theme} lesson={lesson} />
      )}

      {/* Footer — mark complete */}
      <div style={{
        position: 'sticky', bottom: theme.space[3],
        marginTop: theme.space[3],
        display: 'flex', justifyContent: 'flex-end',
      }}>
        <Button
          theme={theme}
          variant={isDone ? 'ghost' : 'primary'}
          onClick={() => onComplete(lesson.id)}
          disabled={isDone}
        >
          {isDone ? 'Completed' : 'Mark complete'}
        </Button>
      </div>
    </div>
  );
}

// ─── Learn view — concept blocks + per-concept notes ────────────────────
function LearnView({ theme, lesson, notes, onSaveNote }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[4] }}>
      {(lesson.learn || []).map((block, idx) => (
        <Card key={idx} theme={theme}>
          <div style={{
            fontFamily: theme.type.serif,
            fontSize: theme.fontSize.md,
            fontWeight: 500,
            color: theme.fg,
            marginBottom: theme.space[2],
            letterSpacing: '-0.01em',
          }}>{block.title}</div>
          <div style={{
            fontSize: theme.fontSize.base,
            color: theme.fg,
            lineHeight: 1.55,
            opacity: 0.9,
          }}>{block.body}</div>
          <NoteField
            theme={theme}
            initialValue={notes[idx] || ''}
            onSave={(body) => onSaveNote(idx, body)}
          />
        </Card>
      ))}
    </div>
  );
}

// Collapsible textarea, 800ms debounced save.
function NoteField({ theme, initialValue, onSave }) {
  const [open, setOpen] = React.useState(!!initialValue);
  const [value, setValue] = React.useState(initialValue || '');
  const timer = React.useRef(null);

  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function handleChange(e) {
    const v = e.target.value;
    setValue(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onSave(v), 800);
  }

  return (
    <div style={{ marginTop: theme.space[3] }}>
      {!open ? (
        <button
          className="ak-btn"
          onClick={() => setOpen(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: theme.muted,
            fontFamily: theme.type.mono,
            fontSize: theme.fontSize.xs,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: 0,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}
        >
          {UI_ICONS.Plus(undefined, 12)}
          add note
        </button>
      ) : (
        <div>
          <div style={{
            fontFamily: theme.type.mono,
            fontSize: theme.fontSize.xs,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: theme.muted,
            marginBottom: 4,
          }}>your note</div>
          <textarea
            className="lai-textarea"
            value={value}
            onChange={handleChange}
            placeholder="What clicked? What didn't?"
          />
        </div>
      )}
    </div>
  );
}

// ─── Quiz view ──────────────────────────────────────────────────────────
function QuizView({ theme, lesson, attempt, onAnswer }) {
  const q = lesson.quiz;
  if (!q) {
    return <EmptyState theme={theme} title="No quiz for this lesson" />;
  }
  const answered = !!attempt;
  const selected = attempt?.selected;
  const wasCorrect = attempt?.correct;

  function tone(i) {
    if (!answered) return 'idle';
    if (i === q.correct) return 'correct';
    if (i === selected && !wasCorrect) return 'wrong';
    return 'idle';
  }

  function bg(i) {
    const c = tone(i);
    if (c === 'correct') return `color-mix(in oklch, ${theme.ok} 18%, ${theme.card})`;
    if (c === 'wrong')   return `color-mix(in oklch, ${theme.danger} 18%, ${theme.card})`;
    return theme.card;
  }
  function border(i) {
    const c = tone(i);
    if (c === 'correct') return theme.ok;
    if (c === 'wrong')   return theme.danger;
    return theme.border;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[4] }}>
      <Card theme={theme} tone="elev">
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[2],
        }}>Question</div>
        <div style={{
          fontFamily: theme.type.serif,
          fontSize: theme.fontSize.md,
          color: theme.fg,
          lineHeight: 1.4,
        }}>{q.q}</div>
      </Card>

      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[2] }}>
        {q.opts.map((opt, i) => (
          <button
            key={i}
            className="ak-btn"
            onClick={() => !answered && onAnswer(i, i === q.correct)}
            disabled={answered}
            style={{
              textAlign: 'left',
              padding: `${theme.space[3]}px ${theme.space[4]}px`,
              background: bg(i),
              border: `1.5px solid ${border(i)}`,
              borderRadius: theme.radius.md,
              color: theme.fg,
              fontFamily: theme.type.sans,
              fontSize: theme.fontSize.base,
              lineHeight: 1.4,
              minHeight: theme.density.hitTarget,
              opacity: answered && i !== q.correct && i !== selected ? 0.55 : 1,
              cursor: answered ? 'default' : 'pointer',
              display: 'flex', alignItems: 'flex-start', gap: theme.space[3],
            }}
          >
            <span style={{
              width: 24, height: 24, borderRadius: 12,
              background: theme.cardElev,
              border: `1px solid ${border(i)}`,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: theme.type.mono, fontSize: theme.fontSize.xs,
              color: theme.muted,
              flexShrink: 0, marginTop: 1,
            }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ flex: 1 }}>{opt}</span>
          </button>
        ))}
      </div>

      {answered && (
        <Card
          theme={theme}
          style={{
            borderColor: wasCorrect ? theme.ok : theme.danger,
          }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', gap: theme.space[2],
            marginBottom: theme.space[2],
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: 5,
              background: wasCorrect ? theme.ok : theme.danger,
            }} />
            <span style={{
              fontFamily: theme.type.mono,
              fontSize: theme.fontSize.xs,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: wasCorrect ? theme.ok : theme.danger,
            }}>
              {wasCorrect ? 'Correct' : 'Not quite'}
            </span>
          </div>
          <div style={{
            fontSize: theme.fontSize.base,
            color: theme.fg,
            lineHeight: 1.55,
          }}>{q.explanation}</div>
        </Card>
      )}
    </div>
  );
}

// ─── Build view ─────────────────────────────────────────────────────────
function BuildView({ theme, lesson }) {
  const steps = lesson.project || [];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[4] }}>
      <div>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[3],
        }}>Try this together</div>
        {steps.length === 0 ? (
          <EmptyState theme={theme} title="No project steps for this lesson" />
        ) : (
          <List theme={theme}>
            {steps.map((s, i) => (
              <ListRow
                key={i}
                theme={theme}
                title={s}
                leading={
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: theme.card,
                    border: `1px solid ${theme.border}`,
                    color: theme.fg,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: theme.type.mono, fontSize: theme.fontSize.sm, fontWeight: 600,
                    flexShrink: 0,
                  }}>{i + 1}</span>
                }
                style={{ alignItems: 'flex-start' }}
              />
            ))}
          </List>
        )}
      </div>

      {lesson.ownProject && (
        <Card theme={theme} tone="elev">
          <div style={{
            fontFamily: theme.type.mono,
            fontSize: theme.fontSize.xs,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: theme.warn,
            marginBottom: theme.space[2],
          }}>Or come up with your own</div>
          <div style={{
            fontSize: theme.fontSize.base,
            color: theme.fg,
            lineHeight: 1.55,
          }}>{lesson.ownProject}</div>
        </Card>
      )}
    </div>
  );
}

window.LessonDetail = LessonDetail;
