import { useEffect, useState } from 'react'
import { api } from '../../services/api'

// ─── Composant principal ────────────────────────────────────────────────────
export function InstructeursPage() {
  const [instructeurs, setInstructeurs] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)

  useEffect(() => {
    // On appelle directement l'endpoint dédié /api/instructors
    api.instructors.getAll()
      .then(setInstructeurs)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <section className="card"><p>Chargement des instructeurs…</p></section>
  }

  if (error) {
    return <section className="card"><p style={{ color: 'red' }}>Erreur : {error}</p></section>
  }

  if (instructeurs.length === 0) {
    return (
      <section className="card" style={{ textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Les instructeurs</h1>
        <p>Aucun instructeur n'est encore inscrit sur la plateforme.</p>
      </section>
    )
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Les instructeurs</h1>
      <p style={{ marginBottom: '2rem', opacity: 0.7 }}>
        Découvrez l'équipe qui vous accompagne dans votre pratique de l'apnée.
      </p>

      {/* Grille responsive : 1 colonne sur mobile, 2-3 sur grand écran */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {instructeurs.map((inst) => (
          <InstructeurCard key={inst.id} instructeur={inst} />
        ))}
      </div>
    </section>
  )
}

// ─── Sous-composant : card d'un instructeur ─────────────────────────────────
function InstructeurCard({ instructeur }) {
  // Initiales pour l'avatar de fallback (quand pas de photo)
  // ex: "Jean Dupont" → "JD"
  const initiales = instructeur.name
    .split(' ')
    .map((mot) => mot[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')

  return (
    <article
      style={{
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Zone photo / avatar ────────────────────────────────────────── */}
      <div
        style={{
          height: 180,
          background: 'rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {instructeur.photoUrl ? (
          // Photo réelle si l'instructeur en a une
          <img
            src={instructeur.photoUrl}
            alt={`Photo de ${instructeur.name}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            // Si l'URL est cassée, on masque l'img (l'avatar s'affichera à la place)
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          // Avatar avec les initiales si pas de photo
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--primary, #0ea5e9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#fff',
            }}
          >
            {initiales}
          </div>
        )}
      </div>

      {/* ── Zone texte ────────────────────────────────────────────────── */}
      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{instructeur.name}</h2>
        <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.5 }}>{instructeur.email}</p>

        {instructeur.bio ? (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.9rem', lineHeight: 1.6, opacity: 0.85 }}>
            {instructeur.bio}
          </p>
        ) : (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.4, fontStyle: 'italic' }}>
            Pas encore de biographie.
          </p>
        )}
      </div>
    </article>
  )
}
