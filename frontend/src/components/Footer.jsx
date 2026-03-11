import { Link } from 'react-router-dom'

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer
      style={{
        padding: '24px 20px 32px',
        color: '#0f172a',
        backgroundColor: '#cfe9ff',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto', fontSize: 14 }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>© {year} Apnea Flow</div>
          <nav aria-label="Liens légaux">
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <li>
                <Link to="/mentions-legales" style={{ color: 'inherit' }}>
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/politique-de-confidentialite" style={{ color: 'inherit' }}>
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/cookies" style={{ color: 'inherit' }}>
                  Cookies
                </Link>
              </li>
              <li>
                <Link to="/cgu" style={{ color: 'inherit' }}>
                  CGU
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

