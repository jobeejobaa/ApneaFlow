import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../services/api'   // ← le seul import dont on a besoin
import { ProfilPage } from '../../pages/ProfilPage.jsx'

export function AuthPage() {
  const token = localStorage.getItem('token')
  if (token) return <ProfilPage />

  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    try {
      // On appelle api.auth.login() — plus aucun fetch, header, ou URL ici
      const data = await api.auth.login(
        String(form.get('email') || ''),
        String(form.get('password') || ''),
      )

      // En cas de succès, on stocke le token et l'utilisateur
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('auth-changed'))
      navigate('/profil', { replace: true })

    } catch (err) {
      // api.js a déjà lancé l'erreur avec le bon message du backend
      alert(err.message)
    }
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
