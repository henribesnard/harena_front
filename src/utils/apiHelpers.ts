/**
 * API Helper utilities for error handling and authentication
 */

/**
 * Vérifie si une erreur est une erreur 401 (Unauthorized)
 * et redirige vers la page de login si nécessaire
 */
export const handleApiError = (error: unknown, logout?: () => void): void => {
  if (error instanceof Response) {
    if (error.status === 401) {
      console.warn('Token expiré ou invalide - Redirection vers la page de connexion')

      // Déconnexion si la fonction logout est fournie
      if (logout) {
        logout()
      }

      // Redirection vers la page de login
      window.location.href = '/login'
    }
  } else if (error && typeof error === 'object' && 'status' in error) {
    const errorWithStatus = error as { status: number }
    if (errorWithStatus.status === 401) {
      console.warn('Token expiré ou invalide - Redirection vers la page de connexion')

      if (logout) {
        logout()
      }

      window.location.href = '/login'
    }
  }
}

/**
 * Wrapper pour les appels fetch qui gère automatiquement les erreurs 401
 */
export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  logout?: () => void
): Promise<Response> => {
  try {
    const response = await fetch(url, options)

    // Vérifier si c'est une erreur 401
    if (response.status === 401) {
      handleApiError(response, logout)
      throw new Error('Unauthorized - Token expiré ou invalide')
    }

    return response
  } catch (error) {
    // Si l'erreur n'est pas déjà gérée, la relancer
    throw error
  }
}

/**
 * Extrait les détails d'erreur d'une réponse HTTP
 */
export const extractErrorDetails = async (response: Response): Promise<string> => {
  try {
    const data = await response.json()

    // Vérifier les différents formats de message d'erreur
    if (data.detail) {
      return typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail)
    }

    if (data.message) {
      return data.message
    }

    if (data.error) {
      return data.error
    }

    return `Erreur ${response.status}: ${response.statusText}`
  } catch (e) {
    return `Erreur ${response.status}: ${response.statusText}`
  }
}

/**
 * Vérifie si un token JWT est expiré (sans validation de signature)
 * Retourne true si le token est expiré ou invalide
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    // Décoder le payload du token JWT
    const base64Url = token.split('.')[1]
    if (!base64Url) return true

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    const payload = JSON.parse(jsonPayload)

    // Vérifier l'expiration
    if (payload.exp) {
      const expirationDate = new Date(payload.exp * 1000)
      const now = new Date()
      return now >= expirationDate
    }

    return false
  } catch (e) {
    console.error('Erreur lors de la vérification du token:', e)
    return true // Considérer comme expiré en cas d'erreur
  }
}
