import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function ProfilPage() {
  const navigate = useNavigate()

  // ── On lit l'utilisateur depuis localStorage ──────────────────────────────
  // On utilise useState avec une fonction d'initialisation (lazy init).
  // La fonction entre parenthèses ne s'exécute qu'une seule fois au montage,
  // pas à chaque re-render. C'est plus propre que useMemo pour ce cas.
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null')
    } catch {
      return null
    }
  })

  // ── États pour le mode édition ────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false)

  const [form, setForm] = useState({
    name: user?.name ?? '',
    bio:  user?.bio  ?? '',
  })

  // photoFile = le fichier sélectionné (objet File du navigateur)
  // photoPreview = l'URL locale pour afficher l'aperçu avant upload
  const [photoFile, setPhotoFile]       = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl ?? '')

  const [saving, setSaving]       = useState(false)
  const [saveError, setSaveError] = useState('')

  const isInstructeur = user?.role === 'INSTRUCTEUR'

  // ── Déconnexion ───────────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/', { replace: true })
  }

  // ── Mise à jour des champs texte ─────────────────────────────────────────
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ── Sélection d'un fichier photo ──────────────────────────────────────────
  // Quand l'utilisateur choisit un fichier :
  //   1. On stocke l'objet File pour l'envoyer plus tard
  //   2. On crée une URL locale (URL.createObjectURL) pour afficher l'aperçu
  //      sans avoir à l'uploader d'abord — c'est instantané
  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  // ── Sauvegarde du profil ──────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError('')

    try {
      // Étape 1 : si un nouveau fichier a été sélectionné, on l'uploade d'abord
      if (photoFile) {
        await api.instructors.uploadPhoto(photoFile)
      }

      // Étape 2 : on met à jour le nom et la bio
      const updated = await api.instructors.updateMyProfile(form)

      const newUser = { ...user, ...updated }
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setPhotoFile(null)
      setIsEditing(false)

    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  // ── Annulation ────────────────────────────────────────────────────────────
  function handleCancel() {
    setForm({ name: user?.name ?? '', bio: user?.bio ?? '' })
    setPhotoFile(null)
    setPhotoPreview(user?.photoUrl ?? '')
    setSaveError('')
    setIsEditing(false)
  }

  // ── Pas connecté ──────────────────────────────────────────────────────────
  if (!user) {
    return (
      <section className="card" style={{ textAlign: 'left' }}>
        <h1 style={{ marginTop: 0 }}>Profil</h1>
        <p>Tu n'es pas connecté.</p>
      </section>
    )
  }

  return (
    <section className="card" style={{ textAlign: 'left' }}>
      <h1 style={{ marginTop: 0 }}>Mon profil</h1>

      {/* ── MODE LECTURE ───────────────────────────────────────────────── */}
      {!isEditing && (
        <>
          {/* Photo de profil (instructeurs seulement) */}
          {isInstructeur && (
            <div style={{ marginBottom: '1.25rem' }}>
              {user.photoUrl ? (
                <img
                  // Si l'URL commence par "/uploads", on préfixe avec l'URL du backend
                  src={user.photoUrl.startsWith('/') ? `http://localhost:4000${user.photoUrl}` : user.photoUrl}
                  alt="Photo de profil"
                  style={{
                    width: 100, height: 100,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid rgba(255,255,255,0.15)',
                  }}
                />
              ) : (
                // Avatar initiales si pas de photo
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'var(--primary, #0ea5e9)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', fontWeight: 700, color: '#fff',
                }}>
                  {user.name?.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
            </div>
          )}

          {/* Infos de base */}
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Nom</strong> : {user.name}</div>
            <div><strong>Email</strong> : {user.email}</div>
            <div><strong>Rôle</strong> : {user.role}</div>

            {/* Bio (instructeurs seulement) */}
            {isInstructeur && (
              <div style={{ marginTop: 4 }}>
                <strong>Bio</strong> :{' '}
                {user.bio
                  ? <span style={{ opacity: 0.85 }}>{user.bio}</span>
                  : <span style={{ opacity: 0.4, fontStyle: 'italic' }}>Non renseignée</span>
                }
              </div>
            )}
          </div>

          {/* Boutons */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {/* Le bouton "Modifier" n'apparaît que pour les instructeurs */}
            {isInstructeur && (
              <button type="button" onClick={() => setIsEditing(true)}>
                Modifier mon profil
              </button>
            )}
            <button type="button" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        </>
      )}

      {/* ── MODE ÉDITION (instructeurs seulement) ──────────────────────── */}
      {isEditing && (
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 14, maxWidth: 520 }}>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>Nom</span>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span>Bio</span>
            {/* textarea pour les textes longs */}
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              maxLength={1000}
              placeholder="Présente-toi en quelques lignes…"
              style={{ resize: 'vertical', fontFamily: 'inherit', padding: '0.5rem' }}
            />
            {/* Compteur de caractères pour que l'utilisateur sache où il en est */}
            <span style={{ fontSize: '0.75rem', opacity: 0.4, textAlign: 'right' }}>
              {form.bio.length} / 1000
            </span>
          </label>

          <label style={{ display: 'grid', gap: 8 }}>
            <span>Photo de profil</span>

            {/* Aperçu : on montre la preview locale si un fichier est choisi,
                sinon la photo actuelle depuis le serveur */}
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Aperçu"
                style={{
                  width: 90, height: 90, borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)',
                }}
              />
            )}

            {/* L'input type="file" ouvre le sélecteur de fichiers du système.
                accept= limite les types visibles dans le sélecteur */}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoChange}
              style={{ fontSize: '0.9rem' }}
            />
            <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>
              JPG, PNG, WEBP ou GIF — 3 Mo max
            </span>
          </label>

          {/* Message d'erreur si la sauvegarde échoue */}
          {saveError && (
            <p style={{ color: '#ef4444', margin: 0 }}>{saveError}</p>
          )}

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving}>
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
            <button type="button" onClick={handleCancel} disabled={saving}>
              Annuler
            </button>
          </div>

        </form>
      )}
    </section>
  )
}
