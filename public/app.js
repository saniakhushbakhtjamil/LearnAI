// Learn AI together — scaffold root.
// Renders a themed Surface with a single Card to prove the kit loads,
// the theme builds, and ensureKitStyles() injects CSS.

ensureKitStyles();

function App() {
  const t = buildTheme('dark', 'calm');
  return (
    <Surface theme={t}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: t.space[5],
      }}>
        <Card theme={t}>
          <div style={{
            padding: t.space[5],
            fontFamily: t.type.mono,
            fontSize: t.type.base,
            color: t.fg,
          }}>
            Learn AI together · scaffold ok
          </div>
        </Card>
      </div>
    </Surface>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
