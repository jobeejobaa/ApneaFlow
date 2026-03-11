import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'   // ← le seul import dont on a besoin
import { ProfilPage } from './ProfilPage.jsx'

export function InscriptionPage() {
  const token = localStorage.getItem('token')
  if (token) return <ProfilPage />

  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)

    try {
      // api.auth.register fixe le rôle à 'ELEVE' en interne
      // → le formulaire ne propose plus ce choix (faille de sécurité corrigée)
      const data = await api.auth.register(
        String(form.get('name') || ''),
        String(form.get('email') || ''),
        String(form.get('password') || ''),
      )

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      window.dispatchEvent(new Event('auth-changed'))

      // On redirige vers le profil au lieu d'un alert()
      navigate('/profil', { replace: true })

    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Inscription</h1>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span>Nom</span>
          <input name="name" required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Email</span>
          <input name="email" type="email" required />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Mot de passe</span>
          <input name="password" type="password" minLength={8} required />
        </label>

        {/* Le champ "Rôle" a été supprimé — tout nouvel utilisateur est ÉLÈVE.
            Seul un admin pourra promouvoir quelqu'un INSTRUCTEUR côté back-office. */}

        <button type="submit">Créer mon compte</button>
      </form>
    </section>
  )
}
