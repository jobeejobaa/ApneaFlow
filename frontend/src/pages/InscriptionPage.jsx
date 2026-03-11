import { ProfilPage } from './ProfilPage.jsx'

export function InscriptionPage() {
  const token = localStorage.getItem('token')
  if (token) return <ProfilPage />

  async function onSubmit(e) {
    e.preventDefault()

    const form = new FormData(e.currentTarget)
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      password: String(form.get('password') || ''),
      role: String(form.get('role') || 'ELEVE'),
    }

    const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

    const res = await fetch(`${API}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      alert(data?.message || 'Erreur inscription')
      return
    }

    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.dispatchEvent(new Event('auth-changed'))
    alert('Inscription OK')
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

        <label style={{ display: 'grid', gap: 6 }}>
          <span>Rôle</span>
          <select name="role" defaultValue="ELEVE">
            <option value="ELEVE">ELEVE</option>
            <option value="INSTRUCTEUR">INSTRUCTEUR</option>
          </select>
        </label>

        <button type="submit">Créer mon compte</button>
      </form>
    </section>
  )
}

