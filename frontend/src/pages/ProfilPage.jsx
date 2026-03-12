import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

export function ProfilPage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') }
    catch { return null }
  })

  const [isEditing, setIsEditing] = useState(false)

  // ── Champs du formulaire ──────────────────────────────────────────────────
  const [form, setForm] = useState({
    name:            user?.name  ?? '',
    email:           user?.email ?? '',
    bio:             user?.bio   ?? '',
    // Les champs mot de passe sont vides par défaut — l'utilisateur ne les
    // remplit que s'il veut changer son mot de passe
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  })

  const [photoFile, setPhotoFile]       = useState(null)
  const [photoPreview, setPhotoPreview] = useState(user?.photoUrl ?? '')
  const [saving, setSaving]             = useState(false)
  const [saveError, setSaveError]       = useState('')

  const isInstructeur = user?.role === 'INSTRUCTEUR'

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/', { replace: true })
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handlePhotoChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  // ── Sauvegarde ───────────────────────────────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    setSaveError('')

    // Validation côté frontend avant d'envoyer quoi que ce soit
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setSaveError('Les deux nouveaux mots de passe ne correspondent pas.')
      return
    }

    setSaving(true)
    try {
      // ── Appel 1 : infos du compte (nom, email, mdp) ──────────────────────
      // On construit l'objet à envoyer — on n'inclut newPassword et
      // currentPassword que si l'utilisateur a rempli le champ
      const accountPayload = { name: form.name, email: form.email }
      if (form.newPassword) {
        accountPayload.currentPassword = form.currentPassword
        accountPayload.newPassword     = form.newPassword
      }
      const updatedAccount = await api.users.updateMe(accountPayload)

      // ── Appel 2 : bio (instructeurs seulement) ───────────────────────────
      let updatedProfile = {}
      if (isInstructeur) {
        updatedProfile = await api.instructors.updateMyProfile({ bio: form.bio })
      }

      // ── Appel 3 : photo (instructeurs seulement, si nouveau fichier) ─────
      if (isInstructeur && photoFile) {
        updatedProfile = await api.instructors.uploadPhoto(photoFile)
      }

      // On fusionne tout et on met à jour localStorage + state
      const newUser = { ...user, ...updatedAccount, ...updatedProfile }
      localStorage.setItem('user', JSON.stringify(newUser))
      setUser(newUser)
      setPhotoFile(null)
      // On vide les champs mot de passe après sauvegarde
      setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      setIsEditing(false)

    } catch (err) {
      setSaveError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setForm({
      name:            user?.name  ?? '',
      email:           user?.email ?? '',
      bio:             user?.bio   ?? '',
      currentPassword: '',
      newPassword:     '',
      confirmPassword: '',
    })
    setPhotoFile(null)
    setPhotoPreview(user?.photoUrl ?? '')
    setSaveError('')
    setIsEditing(false)
  }

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

      {/* ── MODE LECTURE ─────────────────────────────────────────────────── */}
      {!isEditing && (
        <>
          {isInstructeur && (
            <div style={{ marginBottom: '1.25rem' }}>
              {user.photoUrl ? (
                <img
                  src={user.photoUrl.startsWith('/') ? `http://localhost:4000${user.photoUrl}` : user.photoUrl}
                  alt="Photo de profil"
                  style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.15)' }}
                />
              ) : (
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--primary, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 700, color: '#fff' }}>
                  {user.name?.split(' ').map(m => m[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Nom</strong> : {user.name}</div>
            <div><strong>Email</strong> : {user.email}</div>
            <div><strong>Rôle</strong> : {user.role}</div>
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

          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button type="button" onClick={() => setIsEditing(true)}>
              Modifier mon profil
            </button>
            <button type="button" onClick={logout}>
              Se déconnecter
            </button>
          </div>
        </>
      )}

      {/* ── MODE ÉDITION ─────────────────────────────────────────────────── */}
      {isEditing && (
        <form onSubmit={handleSave} style={{ display: 'grid', gap: 20, maxWidth: 520 }}>

          {/* ── Section : infos du compte ─────────────────────────────────── */}
          <fieldset style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '1rem' }}>
            <legend style={{ padding: '0 8px', opacity: 0.6, fontSize: '0.85rem' }}>Informations du compte</legend>

            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Nom</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span>Adresse email</span>
                <input name="email" type="email" value={form.email} onChange={handleChange} required />
              </label>
            </div>
          </fieldset>

          {/* ── Section : changer le mot de passe ────────────────────────── */}
          {/* Ces champs sont optionnels — laisser vide = ne pas changer le mdp */}
          <fieldset style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '1rem' }}>
            <legend style={{ padding: '0 8px', opacity: 0.6, fontSize: '0.85rem' }}>Changer le mot de passe <span style={{ opacity: 0.5 }}>(optionnel)</span></legend>

            <div style={{ display: 'grid', gap: 12 }}>
              <label style={{ display: 'grid', gap: 6 }}>
                <span>Mot de passe actuel</span>
                <input name="currentPassword" type="password" value={form.currentPassword} onChange={handleChange} autoComplete="current-password" />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span>Nouveau mot de passe</span>
                <input name="newPassword" type="password" value={form.newPassword} onChange={handleChange} minLength={8} autoComplete="new-password" />
              </label>

              <label style={{ display: 'grid', gap: 6 }}>
                <span>Confirmer le nouveau mot de passe</span>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} minLength={8} autoComplete="new-password" />
              </label>
            </div>
          </fieldset>

          {/* ── Section : profil instructeur ──────────────────────────────── */}
          {isInstructeur && (
            <fieldset style={{ border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '1rem' }}>
              <legend style={{ padding: '0 8px', opacity: 0.6, fontSize: '0.85rem' }}>Profil instructeur</legend>

              <div style={{ display: 'grid', gap: 12 }}>
                <label style={{ display: 'grid', gap: 6 }}>
                  <span>Bio</span>
                  <textarea
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={1000}
                    placeholder="Présente-toi en quelques lignes…"
                    style={{ resize: 'vertical', fontFamily: 'inherit', padding: '0.5rem' }}
                  />
                  <span style={{ fontSize: '0.75rem', opacity: 0.4, textAlign: 'right' }}>
                    {form.bio.length} / 1000
                  </span>
                </label>

                <label style={{ display: 'grid', gap: 8 }}>
                  <span>Photo de profil</span>
                  {photoPreview && (
                    <img
                      src={photoPreview.startsWith('/') ? `http://localhost:4000${photoPreview}` : photoPreview}
                      alt="Aperçu"
                      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }}
                    />
                  )}
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handlePhotoChange} style={{ fontSize: '0.9rem' }} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.4 }}>JPG, PNG, WEBP ou GIF — 3 Mo max</span>
                </label>
              </div>
            </fieldset>
          )}

          {saveError && <p style={{ color: '#ef4444', margin: 0 }}>{saveError}</p>}

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
