import { useEffect, useState } from 'react'
import { api } from '../../services/api'

// ─── Labels lisibles ────────────────────────────────────────────────────────
const COURSE_LABELS  = { INITIATION: 'Initiation', AIDA1: 'AIDA 1', AIDA2: 'AIDA 2', AIDA3: 'AIDA 3', AIDA4: 'AIDA 4', AIDA_INSTRUCTEUR: 'AIDA Instructeur' }
const LOCATION_LABELS = { PISCINE: '🏊 Piscine', MER: '🌊 Mer', BLUE_HOLE: '🔵 Blue Hole' }
const TYPE_LABELS = {
  STATIQUE: 'Statique', DYNAMIQUE_PALMES: 'Dyn. palmes', DYNAMIQUE_SANS_PALMES: 'Dyn. sans palmes',
  PROFONDEUR_PALMES: 'Prof. palmes', PROFONDEUR_SANS_PALMES: 'Prof. sans palmes',
  IMMERSION_LIBRE: 'Immersion libre', POIDS_VARIABLE: 'Poids variable', NO_LIMITS: 'No limits',
}
const MOIS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const JOURS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

// Formulaire vide par défaut
const EMPTY_FORM = { title: 'INITIATION', description: '', date: '', location: 'PISCINE', type: 'STATIQUE', capacity: 4 }

// Convertit une Date en chaîne compatible datetime-local (YYYY-MM-DDTHH:mm)
function toDatetimeLocal(date) {
  if (!date) return ''
  const d = new Date(date)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

// ─── Composant principal ────────────────────────────────────────────────────
export function ReserverPage() {
  const [courses, setCourses]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // Mois affiché dans le calendrier
  const today = new Date()
  const [calYear, setCalYear]   = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth()) // 0-11

  // Jour sélectionné dans le calendrier (number ou null)
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  // Mode formulaire : null = caché | 'create' | 'edit'
  const [formMode, setFormMode]       = useState(null)
  const [editingId, setEditingId]     = useState(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [formSaving, setFormSaving]   = useState(false)
  const [formError, setFormError]     = useState('')

  const userRaw     = localStorage.getItem('user')
  const user        = userRaw ? JSON.parse(userRaw) : null
  const isInstructeur = user?.role === 'INSTRUCTEUR'
  const isEleve       = user?.role === 'ELEVE'

  useEffect(() => {
    api.courses.getAll()
      .then(setCourses)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ── Cours du mois affiché ──────────────────────────────────────────────────
  // On construit un Set des jours qui ont au moins un cours ce mois-ci
  // pour marquer les cases du calendrier rapidement
  const daysWithCourses = new Set(
    courses
      .filter(c => {
        const d = new Date(c.date)
        return d.getFullYear() === calYear && d.getMonth() === calMonth
      })
      .map(c => new Date(c.date).getDate())
  )

  // ── Cours du jour sélectionné ──────────────────────────────────────────────
  const coursesForDay = selectedDay
    ? courses.filter(c => {
        const d = new Date(c.date)
        return d.getFullYear() === calYear && d.getMonth() === calMonth && d.getDate() === selectedDay
      })
    : []

  // ── Navigation calendrier ─────────────────────────────────────────────────
  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
    setSelectedDay(null)
  }

  // ── Formulaire ────────────────────────────────────────────────────────────
  function handleChange(e) {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm(prev => ({ ...prev, [e.target.name]: val }))
  }

  function openCreate() {
    // Pré-remplit la date avec le jour sélectionné à midi
    const preDate = selectedDay
      ? toDatetimeLocal(new Date(calYear, calMonth, selectedDay, 12, 0))
      : ''
    setForm({ ...EMPTY_FORM, date: preDate })
    setEditingId(null)
    setFormMode('create')
    setFormError('')
  }

  function openEdit(course) {
    setForm({
      title:       course.title,
      description: course.description,
      date:        toDatetimeLocal(course.date),
      location:    course.location,
      type:        course.type,
      capacity:    course.capacity,
    })
    setEditingId(course.id)
    setFormMode('edit')
    setFormError('')
  }

  function closeForm() { setFormMode(null); setEditingId(null); setFormError('') }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setFormSaving(true)
    setFormError('')
    try {
      if (formMode === 'create') {
        const created = await api.courses.create(form)
        setCourses(prev => [...prev, created])
      } else {
        const updated = await api.courses.update(editingId, form)
        setCourses(prev => prev.map(c => c.id === editingId ? updated : c))
      }
      closeForm()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setFormSaving(false)
    }
  }

  async function handleDelete(courseId) {
    if (!window.confirm('Supprimer ce cours ? Les inscriptions seront aussi supprimées.')) return
    try {
      await api.courses.remove(courseId)
      setCourses(prev => prev.filter(c => c.id !== courseId))
    } catch (err) {
      alert(err.message)
    }
  }

  function onEnrolled(courseId) {
    setCourses(prev => prev.map(c =>
      c.id === courseId ? { ...c, _count: { enrollments: c._count.enrollments + 1 } } : c
    ))
  }

  if (loading) return <section className="card"><p>Chargement…</p></section>
  if (error)   return <section className="card"><p style={{ color: 'red' }}>Erreur : {error}</p></section>

  return (
    <section className="card" style={{ textAlign: 'left' }}>

      {/* ── En-tête ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Réserver un cours</h1>
        {isInstructeur && (
          <button onClick={openCreate} style={{ padding: '0.4rem 1rem' }}>
            + Créer un cours
          </button>
        )}
      </div>

      {/* ── Calendrier ────────────────────────────────────────────────── */}
      <Calendar
        year={calYear} month={calMonth}
        daysWithCourses={daysWithCourses}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        onPrev={prevMonth} onNext={nextMonth}
        today={today}
      />

      {/* ── Formulaire (create / edit) ─────────────────────────────── */}
      {formMode && (
        <CourseForm
          mode={formMode} form={form} saving={formSaving} error={formError}
          onChange={handleChange} onSubmit={handleFormSubmit} onCancel={closeForm}
        />
      )}

      {/* ── Cours du jour sélectionné ─────────────────────────────── */}
      {selectedDay && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 style={{ fontSize: '1rem', marginBottom: '0.75rem', opacity: 0.7 }}>
            {selectedDay} {MOIS_FR[calMonth]} {calYear}
          </h2>
          {coursesForDay.length === 0
            ? <p style={{ opacity: 0.5, fontStyle: 'italic' }}>Aucun cours ce jour.</p>
            : coursesForDay.map(course => (
                <CourseCard
                  key={course.id} course={course}
                  user={user} isEleve={isEleve} isInstructeur={isInstructeur}
                  onEnrolled={onEnrolled} onEdit={openEdit} onDelete={handleDelete}
                />
              ))
          }
        </div>
      )}
    </section>
  )
}

// ─── Calendrier ─────────────────────────────────────────────────────────────
function Calendar({ year, month, daysWithCourses, selectedDay, onSelectDay, onPrev, onNext, today }) {
  // Nombre de jours dans le mois
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Décalage pour commencer le lundi (0=Lun ... 6=Dim en JS c'est 0=Dim)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const offset = (firstDayOfWeek + 6) % 7 // 0=Lun, 6=Dim

  // Cellules : null pour les cases vides, number pour les jours
  const cells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  const isToday = (d) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  return (
    <div>
      {/* Navigation mois */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
        <button onClick={onPrev} style={{ padding: '0.25rem 0.75rem' }}>‹</button>
        <strong style={{ minWidth: 160, textAlign: 'center' }}>{MOIS_FR[month]} {year}</strong>
        <button onClick={onNext} style={{ padding: '0.25rem 0.75rem' }}>›</button>
      </div>

      {/* Grille */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {/* En-têtes jours */}
        {JOURS_FR.map(j => (
          <div key={j} style={{ textAlign: 'center', fontSize: '0.75rem', opacity: 0.5, paddingBottom: 4 }}>{j}</div>
        ))}

        {/* Cases */}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />
          const hasCourse = daysWithCourses.has(day)
          const isSelected = day === selectedDay
          const isTodayDay = isToday(day)
          return (
            <button
              key={day}
              onClick={() => onSelectDay(day === selectedDay ? null : day)}
              style={{
                position: 'relative',
                padding: '0.4rem 0',
                borderRadius: 8,
                border: isSelected ? '2px solid var(--primary, #0ea5e9)' : '2px solid transparent',
                background: isSelected ? 'rgba(14,165,233,0.15)' : isTodayDay ? 'rgba(255,255,255,0.08)' : 'transparent',
                cursor: 'pointer',
                fontWeight: isTodayDay ? 700 : 400,
                color: 'inherit',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>{day}</span>
              {/* Icône 🤿 si ce jour a des cours */}
              {hasCourse && <span style={{ fontSize: '0.65rem', lineHeight: 1 }}>🤿</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Formulaire création / modification ─────────────────────────────────────
function CourseForm({ mode, form, saving, error, onChange, onSubmit, onCancel }) {
  return (
    <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(255,255,255,0.05)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)' }}>
      <h2 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>
        {mode === 'create' ? '+ Nouveau cours' : '✏️ Modifier le cours'}
      </h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, maxWidth: 500 }}>

        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: '0.85rem' }}>Niveau</span>
          <select name="title" value={form.title} onChange={onChange}>
            {Object.entries(COURSE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: '0.85rem' }}>Description</span>
          <textarea name="description" value={form.description} onChange={onChange} rows={3} required style={{ fontFamily: 'inherit', padding: '0.4rem', resize: 'vertical' }} />
        </label>

        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: '0.85rem' }}>Date et heure</span>
          <input name="date" type="datetime-local" value={form.date} onChange={onChange} required />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: '0.85rem' }}>Lieu</span>
            <select name="location" value={form.location} onChange={onChange}>
              {Object.entries(LOCATION_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
          <label style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: '0.85rem' }}>Capacité (max 4)</span>
            <input name="capacity" type="number" min={1} max={4} value={form.capacity} onChange={onChange} required />
          </label>
        </div>

        <label style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: '0.85rem' }}>Type de cours</span>
          <select name="type" value={form.type} onChange={onChange}>
            {Object.entries(TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>

        {error && <p style={{ color: '#ef4444', margin: 0, fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={saving}>{saving ? 'Sauvegarde…' : mode === 'create' ? 'Créer' : 'Sauvegarder'}</button>
          <button type="button" onClick={onCancel} disabled={saving}>Annuler</button>
        </div>
      </form>
    </div>
  )
}

// ─── Card d'un cours ────────────────────────────────────────────────────────
function CourseCard({ course, user, isEleve, isInstructeur, onEnrolled, onEdit, onDelete }) {
  const [withEquipment, setWithEquipment] = useState(false)
  const [status, setStatus]   = useState('idle')
  const [enrollError, setEnrollError] = useState('')

  const placesRestantes = course.capacity - course._count.enrollments
  const complet = placesRestantes <= 0
  const isOwner = isInstructeur && course.createdBy?.id === user?.id

  async function handleReserver() {
    setStatus('loading'); setEnrollError('')
    try {
      await api.enrollments.enroll(course.id, withEquipment)
      setStatus('done'); onEnrolled(course.id)
    } catch (err) { setEnrollError(err.message); setStatus('error') }
  }

  return (
    <article style={{ padding: '1rem', marginBottom: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <strong>{COURSE_LABELS[course.title] ?? course.title}</strong>
          <span style={{ marginLeft: 10, fontSize: '0.8rem', opacity: 0.6 }}>
            {LOCATION_LABELS[course.location]} · {TYPE_LABELS[course.type]}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, padding: '2px 10px', borderRadius: 999, background: complet ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)', color: complet ? '#ef4444' : '#22c55e' }}>
          {complet ? 'Complet' : `${placesRestantes} place${placesRestantes > 1 ? 's' : ''}`}
        </span>
      </div>

      <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', opacity: 0.7 }}>{course.description}</p>
      <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', opacity: 0.5 }}>
        Instructeur : {course.createdBy?.name ?? '—'} · {new Date(course.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
      </p>

      {/* Actions ÉLÈVE */}
      {isEleve && !complet && status !== 'done' && (
        <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={withEquipment} onChange={e => setWithEquipment(e.target.checked)} />
            Avec équipement
          </label>
          <button onClick={handleReserver} disabled={status === 'loading'} style={{ padding: '0.3rem 1rem' }}>
            {status === 'loading' ? '…' : 'Réserver'}
          </button>
        </div>
      )}
      {status === 'done' && <p style={{ marginTop: '0.5rem', color: '#22c55e', fontWeight: 600, fontSize: '0.9rem' }}>✓ Inscrit !</p>}
      {status === 'error' && <p style={{ marginTop: '0.5rem', color: '#ef4444', fontSize: '0.9rem' }}>{enrollError}</p>}

      {/* Actions INSTRUCTEUR (seulement pour le créateur du cours) */}
      {isOwner && (
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: 8 }}>
          <button onClick={() => onEdit(course)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}>✏️ Modifier</button>
          <button onClick={() => onDelete(course.id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>🗑 Supprimer</button>
        </div>
      )}
    </article>
  )
}
