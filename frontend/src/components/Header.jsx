import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo_apnea_flow_transparent.png'

export function Header({ title = 'Apnea Flow' }) {
  const [isAuthed, setIsAuthed] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    function sync() {
      setIsAuthed(Boolean(localStorage.getItem('token')))
    }

    window.addEventListener('storage', sync)
    window.addEventListener('auth-changed', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth-changed', sync)
    }
  }, [])

  return (
    <header
      style={{
        padding: '20px 20px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            fontWeight: 800,
            letterSpacing: 0.3,
            color: 'var(--text)',
          }}
        >
          <img
            src={logo}
            alt="Logo Apnea Flow"
            width={32}
            height={32}
            style={{ display: 'block' }}
          />
          {title}
        </Link>

        <nav
          aria-label="Navigation principale"
          style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}
        >
          <HeaderLink to="/">Accueil</HeaderLink>
          <HeaderLink to="/reserver">Réserver un cours</HeaderLink>
          <HeaderLink to="/instructeurs">Les instructeurs</HeaderLink>
          <HeaderLink to="/faq-contact">FAQ</HeaderLink>
          {isAuthed ? (
            <HeaderLink to="/profil">Mon profil</HeaderLink>
          ) : (
            <HeaderLink to="/auth">Connexion / Inscription</HeaderLink>
          )}
        </nav>
      </div>
    </header>
  )
}

function HeaderLink({ to, children }) {
  return (
    <Link
      to={to}
      style={{
        color: 'var(--muted)',
        padding: '8px 10px',
        borderRadius: 10,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {children}
    </Link>
  )
}

