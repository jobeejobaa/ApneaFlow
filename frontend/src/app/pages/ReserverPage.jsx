import { useEffect, useState } from 'react'
import { api } from '../../services/api'

// ─── Labels lisibles pour les enums du backend ─────────────────────────────
const LOCATION_LABELS = {
  PISCINE:    '🏊 Piscine',
  MER:        '🌊 Mer',
  BLUE_HOLE:  '🔵 Blue Hole',
}

const TYPE_LABELS = {
  STATIQUE:               'Statique',
  DYNAMIQUE_PALMES:       'Dyn. avec palmes',
  DYNAMIQUE_SANS_PALMES:  'Dyn. sans palmes',
  PROFONDEUR_PALMES:      'Profondeur avec palmes',
  PROFONDEUR_SANS_PALMES: 'Profondeur sans palmes',
  IMMERSION_LIBRE:        'Immersion libre',
  POIDS_VARIABLE:         'Poids variable',
  NO_LIMITS:              'No limits',
}

const COURSE_LABELS = {
  INITIATION:       'Initiation',
  AIDA1:            'AIDA 1',
  AIDA2:            'AIDA 2',
  AIDA3:            'AIDA 3',
  AIDA4:            'AIDA 4',
  AIDA_INSTRUCTEUR: 'AIDA Instructeur',
}

// ─── Composant principal ────────────────────────────────────────────────────
export function ReserverPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // On lit l'utilisateur connecté depuis le localStorage
  const userRaw = localStorage.getItem('user')
  const user    = userRaw ? JSON.parse(userRaw) : null
  const isEleve = user?.role === 'ELEVE'

  useEffect(() => {
    api.courses.getAll()
      .then(setCourses)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, []) // [] = se déclenche une seule fois au montage du composant

  // Appelé par CourseCard quand une inscription réussit.
  // On met à jour le compteur localement sans refaire un fetch complet.
  function onEnrolled(courseId) {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, _count: { enrollments: c._count.enrollments + 1 } }
          : c,
      ),
    )
  }

  if (loading) return <section className="card"><p>Chargement des cours…</p></section>
  if (error)   return <section className="card"><p style={{ color: 'red' }}>Erreur : {error}</p></section>

  if (courses.length === 0) {
    return (
      <section className="card" style={{ textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Réserver un cours</h1>
        <p>Aucun cours n'est disponible pour le moment. Revenez bientôt !</p>
      </section>
    )
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Réserver un cours</h1>

      {/* Message contextuel selon l'état de connexion */}
      {!user && (
        <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
          Connecte-toi en tant qu'élève pour réserver un cours.
        </p>
      )}
      {user && !isEleve && (
        <p style={{ marginBottom: '1.5rem', opacity: 0.7 }}>
          Les instructeurs ne peuvent pas s'inscrire à des cours.
        </p>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            canEnroll={isEleve}
            onEnrolled={onEnrolled}
          />
        ))}
      </div>
    </section>
  )
}

// ─── Sous-composant : carte d'un cours ─────────────────────────────────────
// On l'isole dans son propre composant pour que chaque carte gère
// son propre état de réservation indépendamment des autres.
function CourseCard({ course, canEnroll, onEnrolled }) {
  const [withEquipment, setWithEquipment] = useState(false)
  // 'idle' = rien, 'loading' = en cours, 'done' = réussi, 'error' = échec
  const [status, setStatus]   = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const placesRestantes = course.capacity - course._count.enrollments
  const complet         = placesRestantes <= 0
  const dateFormatee    = new Date(course.date).toLocaleDateString('fr-FR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  async function handleReserver() {
    setStatus('loading')
    setErrorMsg('')
    try {
      await api.enrollments.enroll(course.id, withEquipment)
      setStatus('done')
      onEnrolled(course.id)
    } catch (err) {
      setErrorMsg(err.message)
      setStatus('error')
    }
  }

  return (
    <article
      style={{
        padding: '1.25rem',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '8px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      {/* En-tête : titre du cours + badge places */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
          {COURSE_LABELS[course.title] ?? course.title}
        </h2>
        <span
          style={{
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: '0.8rem',
            fontWeight: 600,
            background: complet ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)',
            color:      complet ? '#ef4444'              : '#22c55e',
          }}
        >
          {complet
            ? 'Complet'
            : `${placesRestantes} place${placesRestantes > 1 ? 's' : ''} restante${placesRestantes > 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Infos : date, lieu, type, instructeur */}
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.7, textTransform: 'capitalize' }}>
        {dateFormatee}
      </p>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', opacity: 0.6 }}>
        {LOCATION_LABELS[course.location] ?? course.location}
        {' · '}
        {TYPE_LABELS[course.type] ?? course.type}
        {' · '}
        Instructeur : {course.createdBy?.name ?? '—'}
      </p>
      {course.description && (
        <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem' }}>{course.description}</p>
      )}

      {/* Zone de réservation (visible seulement si l'élève peut s'inscrire) */}
      {canEnroll && !complet && status !== 'done' && (
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={withEquipment}
              onChange={(e) => setWithEquipment(e.target.checked)}
            />
            Avec équipement fourni
          </label>

          <button
            onClick={handleReserver}
            disabled={status === 'loading'}
            style={{ padding: '0.4rem 1.2rem' }}
          >
            {status === 'loading' ? 'Réservation…' : 'Réserver'}
          </button>
        </div>
      )}

      {/* Message de succès */}
      {status === 'done' && (
        <p style={{ marginTop: '0.75rem', color: '#22c55e', fontWeight: 600 }}>
          ✓ Inscription confirmée !
        </p>
      )}

      {/* Message d'erreur (ex: "Déjà inscrit", "Cours complet") */}
      {status === 'error' && (
        <p style={{ marginTop: '0.75rem', color: '#ef4444' }}>
          {errorMsg}
        </p>
      )}
    </article>
  )
}
