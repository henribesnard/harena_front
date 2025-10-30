# Scénarios de test - Filtrage des comptes

## 📋 Guide de test manuel

Ce document décrit les scénarios de test à valider pour la fonctionnalité de filtrage des comptes.

---

## ✅ Scénario 1 : Utilisateur avec plusieurs comptes (checking + card + savings)

### Préparation
- Utilisateur ayant au moins :
  - 2 comptes courants (checking)
  - 1 carte bancaire (card)
  - 1 compte épargne (savings)

### Tests à effectuer

**1.1 - Dashboard : Affichage initial**
- [ ] Naviguer vers `/dashboard`
- [ ] Vérifier que la card "Comptes utilisés" s'affiche
- [ ] Vérifier que seuls les comptes checking + card sont listés
- [ ] Vérifier que le compte savings N'apparaît PAS
- [ ] Vérifier que le solde total correspond à la somme des comptes checking + card uniquement

**1.2 - Dashboard : Bouton configurer**
- [ ] Cliquer sur le bouton "Configurer"
- [ ] Vérifier la redirection vers `/configuration?tab=banking`

**1.3 - Settings : Mode "all" par défaut**
- [ ] Naviguer vers `/configuration`, onglet "Comptes bancaires"
- [ ] Défiler jusqu'à la section "Filtrage des comptes"
- [ ] Vérifier que le mode "Tous les comptes éligibles" est sélectionné par défaut
- [ ] Vérifier le message d'explication sur la whitelist (checking + card uniquement)

**1.4 - Settings : Mode "exclude_types" - Exclure les cartes**
- [ ] Sélectionner le mode "Exclure certains types"
- [ ] Cocher "Exclure les cartes bancaires"
- [ ] Vérifier que le bouton "Enregistrer" devient actif
- [ ] Cliquer sur "Enregistrer"
- [ ] Vérifier le toast de confirmation
- [ ] Retourner au Dashboard
- [ ] Vérifier que seuls les comptes checking apparaissent maintenant
- [ ] Vérifier que le solde total a changé

**1.5 - Settings : Mode "include_specific"**
- [ ] Retourner aux settings
- [ ] Sélectionner "Comptes spécifiques"
- [ ] Vérifier que la liste de tous les comptes éligibles apparaît
- [ ] Sélectionner 2 comptes sur 3
- [ ] Cliquer sur "Enregistrer"
- [ ] Retourner au Dashboard
- [ ] Vérifier que seuls les 2 comptes sélectionnés apparaissent

**1.6 - Settings : Réinitialisation**
- [ ] Retourner aux settings
- [ ] Cliquer sur "Réinitialiser"
- [ ] Vérifier que le mode revient à "all"
- [ ] Vérifier que les checkboxes/sélections sont réinitialisées
- [ ] Retourner au Dashboard
- [ ] Vérifier que tous les comptes éligibles apparaissent à nouveau

---

## ✅ Scénario 2 : Badge dans ProfilCard (page Budget)

### Tests à effectuer

**2.1 - Affichage du badge**
- [ ] Naviguer vers une page affichant le ProfilCard (si elle existe)
- [ ] Vérifier la présence du badge "X comptes" dans le header gradient
- [ ] Hover sur l'icône info du badge
- [ ] Vérifier que le tooltip s'affiche avec les explications

**2.2 - Cohérence avec les settings**
- [ ] Noter le nombre de comptes affiché dans le badge
- [ ] Aller aux settings et modifier la sélection (ex: exclure les cartes)
- [ ] Retourner au ProfilCard
- [ ] Vérifier que le badge a été mis à jour avec le nouveau nombre

---

## ✅ Scénario 3 : Page Métriques

### Tests à effectuer

**3.1 - Badge dans la page métriques**
- [ ] Naviguer vers `/metrics` (ou la route des métriques)
- [ ] Vérifier la présence du badge "X comptes" dans le header
- [ ] Vérifier que le nombre correspond à la configuration actuelle

**3.2 - Vérification des données**
- [ ] Noter les valeurs des métriques (YoY, MoM, etc.)
- [ ] Aller aux settings et exclure des comptes
- [ ] Retourner aux métriques
- [ ] Vérifier que les valeurs ont changé (elles devraient refléter les nouveaux comptes)

---

## ✅ Scénario 4 : Utilisateur avec 1 seul compte éligible

### Préparation
- Utilisateur n'ayant qu'un seul compte checking OU card

### Tests à effectuer

**4.1 - Dashboard**
- [ ] Vérifier que "1 compte" s'affiche (singulier, pas pluriel)
- [ ] Vérifier que le compte unique est bien listé

**4.2 - Settings : Validation**
- [ ] Aller aux settings, mode "include_specific"
- [ ] Essayer de tout décocher (aucun compte sélectionné)
- [ ] Cliquer sur "Enregistrer"
- [ ] Vérifier le comportement (devrait permettre de sauvegarder avec 0 compte)

---

## ✅ Scénario 5 : Highlight des comptes éligibles

### Tests à effectuer

**5.1 - BankAccountsList avec highlightEligible**
- [ ] Trouver un composant utilisant `<BankAccountsList highlightEligible={true} />`
- [ ] Vérifier que les comptes checking/card ont :
  - Bordure purple
  - Fond purple-50
  - Badge "Éligible"
- [ ] Vérifier que les comptes savings/loan/investment ont :
  - Opacité réduite (60%)
  - Badge "Exclus auto"

---

## ✅ Scénario 6 : Détection des changements

### Tests à effectuer

**6.1 - Message d'avertissement**
- [ ] Aller aux settings
- [ ] Changer le mode de sélection
- [ ] Vérifier qu'un message d'avertissement "modifications non enregistrées" apparaît
- [ ] Vérifier que le bouton "Enregistrer" devient actif

**6.2 - Navigation sans sauvegarder**
- [ ] Faire des modifications
- [ ] NE PAS sauvegarder
- [ ] Naviguer vers une autre page
- [ ] Retourner aux settings
- [ ] Vérifier que les modifications n'ont PAS été conservées

**6.3 - Sauvegarde et persistance**
- [ ] Faire des modifications
- [ ] Sauvegarder
- [ ] Naviguer vers une autre page
- [ ] Retourner aux settings
- [ ] Vérifier que les modifications SONT conservées

---

## ✅ Scénario 7 : États de chargement

### Tests à effectuer

**7.1 - Loading states**
- [ ] Aller aux settings
- [ ] Observer le spinner de chargement initial
- [ ] Faire une modification et sauvegarder
- [ ] Observer le bouton "Enregistrement..." désactivé pendant la sauvegarde

**7.2 - Réinitialisation**
- [ ] Cliquer sur "Réinitialiser"
- [ ] Observer le bouton "Réinitialisation..." pendant le processus

---

## ✅ Scénario 8 : Gestion des erreurs

### Tests à effectuer

**8.1 - Erreur réseau**
- [ ] Couper la connexion réseau (ou bloquer l'API backend)
- [ ] Essayer de sauvegarder une modification
- [ ] Vérifier qu'un toast d'erreur s'affiche
- [ ] Vérifier que l'interface reste utilisable

**8.2 - Token expiré**
- [ ] Simuler une expiration de token (ou attendre l'expiration naturelle)
- [ ] Essayer une action (sauvegarde, chargement)
- [ ] Vérifier la redirection vers la page de login

---

## ✅ Scénario 9 : Responsive design

### Tests à effectuer

**9.1 - Mobile (viewport < 768px)**
- [ ] Réduire la fenêtre ou utiliser DevTools mobile
- [ ] Dashboard : Vérifier que AccountsUsedCard s'affiche correctement
- [ ] Settings : Vérifier que le panel de configuration est utilisable
- [ ] Vérifier que les tooltips s'affichent correctement

**9.2 - Tablet (viewport 768px - 1024px)**
- [ ] Tester les mêmes pages en mode tablette
- [ ] Vérifier la grille de layout

---

## ✅ Scénario 10 : Accessibilité

### Tests à effectuer

**10.1 - Navigation clavier**
- [ ] Utiliser uniquement le clavier (Tab, Enter, Espace)
- [ ] Naviguer dans le formulaire de settings
- [ ] Sélectionner les différents modes
- [ ] Cocher/décocher les checkboxes
- [ ] Sauvegarder avec Entrée

**10.2 - Screen reader**
- [ ] Activer un lecteur d'écran (NVDA, VoiceOver)
- [ ] Vérifier que les labels sont lus correctement
- [ ] Vérifier que les boutons ont des descriptions claires

---

## 📊 Checklist finale

Après avoir validé tous les scénarios :

- [ ] Tous les comptes éligibles (checking + card) sont bien inclus par défaut
- [ ] Les comptes non-éligibles (savings, loan, investment) sont toujours exclus
- [ ] Les 3 modes de sélection fonctionnent correctement
- [ ] Les modifications sont persistées en base de données
- [ ] Les badges s'affichent partout où ils devraient
- [ ] Le Dashboard affiche les bonnes informations
- [ ] Les métriques reflètent les comptes filtrés
- [ ] L'interface est responsive
- [ ] L'accessibilité est correcte
- [ ] Pas de régression sur les fonctionnalités existantes

---

## 🐛 Bugs connus à surveiller

### Potentiels problèmes

1. **Synchronisation** : Si un compte est ajouté/supprimé pendant qu'on est sur la page settings
   - Solution : Recharger les comptes après un sync

2. **Cache React Query** : Les données peuvent être en cache et ne pas refléter les dernières modifications
   - Solution : Invalider les queries après sauvegarde

3. **Comptes sans type** : Si un compte n'a pas de type défini
   - Solution : Vérifier la gestion des types inconnus

---

## 🧪 Tests automatisés à créer (si framework de test disponible)

### Tests unitaires recommandés

```typescript
// AccountFilterBadge.test.tsx
describe('AccountFilterBadge', () => {
  it('should display compact badge with correct count')
  it('should show tooltip on hover')
  it('should display alert icon when filtered')
  it('should handle missing accounts_used gracefully')
})

// AccountSelectionMode.test.tsx
describe('AccountSelectionMode', () => {
  it('should render all 3 modes')
  it('should call onChange when mode selected')
  it('should be disabled when disabled prop is true')
})

// AccountFilterSettings.test.tsx
describe('AccountFilterSettings', () => {
  it('should detect changes and enable save button')
  it('should show warning for unsaved changes')
  it('should reset to defaults on reset click')
  it('should call onSave with correct selection')
})

// useAccountPreferences.test.ts
describe('useAccountPreferences', () => {
  it('should load preferences on mount')
  it('should update selection correctly')
  it('should reset to defaults')
  it('should handle API errors gracefully')
})
```

---

## 📝 Notes de test

**Backend requis** :
- Backend doit être démarré et accessible
- Base de données doit avoir des données de test
- Au moins 1 utilisateur avec plusieurs comptes de types différents

**Variables d'environnement** :
- `VITE_BUDGET_PROFILING_API_URL` : URL du service de profiling budgétaire

**Utilisateurs de test recommandés** :
- User 3 : 1 seul compte
- User 8 : 6 comptes (checking + card + autres types)

---

**Document créé pour** : Harena Frontend - Account Filtering Feature
**Date** : 2025-10-29
**Version** : 1.0
