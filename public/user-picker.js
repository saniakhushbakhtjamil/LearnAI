// First-run user picker. Mirrors the news app's pattern but with kit Card.
// Two big tap targets. Selection writes to localStorage and bubbles up.

function UserPicker({ theme, onSelect }) {
  const [pressed, setPressed] = React.useState(null);

  function pick(uid) {
    if (pressed) return;
    setPressed(uid);
    setTimeout(() => onSelect(uid), 320);
  }

  const users = [
    { id: 's', display: 'Sania', accent: 'oklch(0.7 0.18 305)' },  // purple
    { id: 'b', display: 'Björn', accent: 'oklch(0.72 0.115 200)' }, // teal
  ];

  return (
    <div
      className="lai-fadein"
      style={{
        minHeight: '100dvh',
        background: theme.dustBg,
        color: theme.fg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.space[5],
        gap: theme.space[5],
        fontFamily: theme.type.sans,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: theme.space[4] }}>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[2],
        }}>
          Twelve weeks · together
        </div>
        <div style={{
          fontFamily: theme.type.serif,
          fontSize: theme.fontSize.xl,
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: theme.fg,
          lineHeight: 1.1,
        }}>
          learn ai together
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: theme.space[3],
        width: '100%',
        maxWidth: 520,
      }}>
        {users.map(u => {
          const isPressed = pressed === u.id;
          return (
            <button
              key={u.id}
              onClick={() => pick(u.id)}
              className="ak-btn"
              style={{
                flex: 1,
                minHeight: 220,
                background: isPressed ? theme.cardElev : theme.card,
                border: `1.5px solid ${isPressed ? u.accent : theme.border}`,
                borderRadius: theme.radius.xl,
                cursor: isPressed ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.space[5],
                transition: '320ms cubic-bezier(.2,.7,.3,1)',
                transform: isPressed ? 'scale(1.03)' : 'scale(1)',
                boxShadow: isPressed ? `0 0 56px ${u.accent}40` : 'none',
                color: theme.fg,
              }}
            >
              <span style={{
                width: 14, height: 14, borderRadius: 7,
                background: u.accent, marginBottom: theme.space[3],
              }} />
              <div style={{
                fontFamily: theme.type.serif,
                fontSize: theme.fontSize.lg,
                fontWeight: 500,
                color: isPressed ? u.accent : theme.fg,
                letterSpacing: '-0.02em',
                lineHeight: 1,
                transition: '320ms cubic-bezier(.2,.7,.3,1)',
              }}>
                I'm {u.display}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{
        fontFamily: theme.type.mono,
        fontSize: theme.fontSize.xs,
        color: theme.muted,
        letterSpacing: '0.08em',
      }}>
        you can switch anytime in the you tab
      </div>
    </div>
  );
}

window.UserPicker = UserPicker;
