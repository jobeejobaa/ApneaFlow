import { ProfilPage } from '../../pages/ProfilPage.jsx'
import { Link, useNavigate } from 'react-router-dom'

export function AuthPage() {
  const token = localStorage.getItem('token')
  if (token) return <ProfilPage />

  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const payload = {
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
    }

    const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'
    const res = await fetch(`${API}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(data?.message || 'Erreur connexion')
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/profil', { replace: true })
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Connexion / Inscription</h1>

      <h2 style={{ margin: '12px 0 6px' }}>Connexion</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input name="email" type="email" required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Mot de passe</span>
          <input name="password" type="password" minLength={8} required />
        </label>

        <button type="submit">Se connecter</button>
      </form>

      <hr style={{ margin: '18px 0', borderColor: 'rgba(255,255,255,0.14)' }} />

      <p style={{ margin: 0 }}>
        Pas encore de compte ? Va sur la page <LinkInline to="/inscription">Inscription</LinkInline>.
      </p>
    </section>
  )
}

function LinkInline({ to, children }) {
  return (
    <Link to={to} style={{ color: 'var(--text)' }}>
      {children}
    </Link>
  )
}

