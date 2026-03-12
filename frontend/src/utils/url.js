const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

/**
 * Transforme un chemin relatif du backend en URL complète.
 * Si le chemin commence par "/", on préfixe avec l'URL du backend.
 * Sinon (URL externe ou null), on retourne la valeur telle quelle.
 *
 * Exemples :
 *   assetUrl('/uploads/photo.jpg')  → 'http://localhost:4000/uploads/photo.jpg'
 *   assetUrl('https://example.com') → 'https://example.com'
 *   assetUrl(null)                  → null
 */
export function assetUrl(path) {
  if (!path) return null
  return path.startsWith('/') ? `${API}${path}` : path
}
