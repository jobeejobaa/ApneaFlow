// ─── Configuration ─────────────────────────────────────────────────────────
// On lit l'URL du backend depuis les variables d'environnement Vite.
// Si VITE_API_URL n'est pas défini (en dev), on pointe sur localhost:4000.
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

// ─── Fonction utilitaire centrale ──────────────────────────────────────────
// Tous les appels HTTP de l'application passent par cette fonction.
// Elle s'occupe automatiquement de :
//   1. Ajouter le header Content-Type: application/json
//   2. Ajouter le token JWT si l'utilisateur est connecté (Authorization: Bearer ...)
//   3. Parser la réponse JSON
//   4. Lancer une erreur JS si le serveur répond en 4xx ou 5xx
//
// Grâce à ça, les composants React n'ont jamais à se préoccuper des headers
// ni de vérifier res.ok — ils appellent juste api.xxx() et gèrent les erreurs.
async function request(path, options = {}) {
  const token = localStorage.getItem('token')

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      // On ajoute le token seulement s'il existe (routes protégées)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // options.headers en dernier pour permettre de les surcharger si besoin
      ...options.headers,
    },
  })

  // On parse le JSON quoi qu'il arrive (succès ou erreur)
  const data = await res.json().catch(() => ({}))

  // Si le serveur répond en erreur, on crée une vraie erreur JavaScript
  // avec le message que le backend a envoyé dans data.message
  if (!res.ok) {
    const err = new Error(data?.message || 'Erreur serveur')
    err.code = data?.code     // ex: 'EMAIL_TAKEN', 'UNAUTHORIZED'
    err.status = res.status   // ex: 400, 401, 403, 404
    throw err
  }

  return data
}

// ─── API exportée ──────────────────────────────────────────────────────────
// On regroupe les fonctions par domaine métier.
// Dans un composant, on importe { api } et on appelle api.auth.login(...)
export const api = {

  // ── Authentification ──────────────────────────────────────────────────────
  auth: {
    login: (email, password) =>
      request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    // On fixe le rôle à 'ELEVE' ici, pas dans le formulaire (sécurité)
    register: (name, email, password) =>
      request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, role: 'ELEVE' }),
      }),
  },

  // ── Cours ─────────────────────────────────────────────────────────────────
  courses: {
    getAll: () =>
      request('/api/courses'),

    getById: (id) =>
      request(`/api/courses/${id}`),

    create: (data) =>
      request('/api/courses', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  },

  // ── Inscriptions aux cours ────────────────────────────────────────────────
  enrollments: {
    // La route backend est POST /courses/:id/enroll
    enroll: (courseId, withEquipment = false) =>
      request(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        body: JSON.stringify({ withEquipment }),
      }),

    // La route backend est GET /me/enrollments
    getMine: () =>
      request('/api/me/enrollments'),
  },

  // ── Instructeurs ──────────────────────────────────────────────────────────
  instructors: {
    // Récupère tous les instructeurs (public)
    getAll: () =>
      request('/api/instructors'),

    // Met à jour le profil de l'instructeur connecté
    // data peut contenir : { name?, bio?, photoUrl? }
    updateMyProfile: (data) =>
      request('/api/instructors/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    // Upload une photo de profil (fichier binaire, pas JSON)
    // On utilise FormData au lieu de JSON.stringify.
    // IMPORTANT : on ne met PAS Content-Type — le navigateur le génère
    // automatiquement avec le bon "boundary" pour le multipart/form-data.
    uploadPhoto: async (file) => {
      const token = localStorage.getItem('token')
      const body  = new FormData()
      body.append('photo', file) // "photo" = le nom du champ attendu par multer

      const res  = await fetch(`${BASE_URL}/api/instructors/me/photo`, {
        method:  'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body,
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const err = new Error(data?.message || 'Erreur upload')
        err.status = res.status
        throw err
      }
      return data
    },
  },
}
