import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export function ProfilPage() {
  const navigate = useNavigate()

  const { token, user } = useMemo(() => {
    const token = localStorage.getItem('token') || ''
    let user = null
    try {
      user = JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      user = null
    }
    return { token, user }
  }, [])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/', { replace: true })
  }

  if (!token) {
    return (
      <section className="card" style={{ textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Profil</h1>
        <p>Tu n’es pas connecté.</p>
      </section>
    )
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Mon profil</h1>

      <div style={{ display: 'grid', gap: 6 }}>
        <div>
          <strong>Nom</strong>: {user?.name || '—'}
        </div>
        <div>
          <strong>Email</strong>: {user?.email || '—'}
        </div>
        <div>
          <strong>Rôle</strong>: {user?.role || '—'}
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" onClick={logout}>
          Se déconnecter
        </button>
      </div>
    </section>
  )
}

