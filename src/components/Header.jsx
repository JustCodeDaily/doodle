import "./Header.styles.css";

export default function Header({ darkMode, onToggleDark }) {
  return (
    <header className="app-header">
      <div className="header-left">
        {/* App icon — a circle with a doodle pencil */}
        <div className="header-icon">
          {/* Simple pencil/noodle icon */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 19c-4 0-7-2-7-5s3-5 7-5 7 2 7 5" />
            <path d="M12 19v3" />
            <circle cx="9" cy="12" r="1" fill="#fff" />
            <circle cx="15" cy="12" r="1" fill="#fff" />
          </svg>
        </div>

        {/* App title and tagline */}
        <div>
          <h1 className="header-title">Judge my noodle</h1>
          <p className="header-tagline">
            Draw it. Get roasted. Make the board.
          </p>
        </div>
      </div>

      {/* Dark mode toggle — sun/moon icon swap */}
      <button
        className="theme-toggle"
        onClick={onToggleDark}
        title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          // Sun icon (shown in dark mode — click to go light)
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        ) : (
          // Moon icon (shown in light mode — click to go dark)
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>
    </header>
  );
}
