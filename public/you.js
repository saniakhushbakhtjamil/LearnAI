// You tab — user switcher + theme palette switcher.

function YouTab({ theme, user, palette, onSwitchUser, onSwitchPalette }) {
  const otherUser = user.id === 's' ? 'b' : 's';
  const otherName = user.id === 's' ? 'Björn' : 'Sania';

  // Four palettes in the kit (no horizon — kit ships dark/warm/light/dusk).
  const palettes = [
    { id: 'dark',  label: 'Dark',   tint: 'oklch(0.68 0.155 30)' },
    { id: 'warm',  label: 'Warm',   tint: 'oklch(0.7 0.16 30)' },
    { id: 'light', label: 'Light',  tint: 'oklch(0.55 0.16 30)' },
    { id: 'dusk',  label: 'Dusk',   tint: 'oklch(0.7 0.16 30)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space[5] }}>
      <Card theme={theme} tone="elev">
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[2],
        }}>Logged in as</div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: theme.space[3],
          marginBottom: theme.space[4],
        }}>
          <span style={{
            width: 36, height: 36, borderRadius: 18,
            background: user.accent || theme.warm,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: theme.inkOnWarm,
            fontFamily: theme.type.serif,
            fontSize: theme.fontSize.md,
            fontWeight: 500,
          }}>{(user.display_name || '?').charAt(0)}</span>
          <div style={{
            fontFamily: theme.type.serif,
            fontSize: theme.fontSize.lg,
            fontWeight: 500,
            color: theme.fg,
            letterSpacing: '-0.02em',
          }}>{user.display_name}</div>
        </div>
        <Button theme={theme} variant="ghost" onClick={() => onSwitchUser(otherUser)}>
          Switch to {otherName}
        </Button>
      </Card>

      <Card theme={theme}>
        <div style={{
          fontFamily: theme.type.mono,
          fontSize: theme.fontSize.xs,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: theme.muted,
          marginBottom: theme.space[3],
        }}>Theme</div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: theme.space[2],
        }}>
          {palettes.map(p => {
            const active = p.id === palette;
            return (
              <button
                key={p.id}
                className="ak-btn"
                onClick={() => onSwitchPalette(p.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: theme.space[2],
                  padding: `${theme.space[2]}px ${theme.space[3]}px`,
                  background: active ? theme.cardElev : theme.card,
                  border: `1.5px solid ${active ? p.tint : theme.border}`,
                  borderRadius: theme.radius.md,
                  color: theme.fg,
                  fontFamily: theme.type.sans,
                  fontSize: theme.fontSize.sm,
                  minHeight: theme.density.hitTarget,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{
                  width: 18, height: 18, borderRadius: 9,
                  background: p.tint,
                  border: `1px solid ${theme.borderSubtle}`,
                  flexShrink: 0,
                }} />
                {p.label}
              </button>
            );
          })}
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
        }}>About</div>
        <div style={{
          fontSize: theme.fontSize.sm,
          color: theme.muted,
          lineHeight: 1.5,
        }}>
          Twelve weeks. Three items each: a lesson, a quiz, and a project.
          Work through it together at your own pace. No deadlines, no streak shame —
          just a place to come back to.
        </div>
      </Card>
    </div>
  );
}

window.YouTab = YouTab;
