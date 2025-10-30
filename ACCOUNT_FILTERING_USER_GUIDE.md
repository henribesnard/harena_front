# Guide utilisateur - Filtrage des comptes

## 🎯 Qu'est-ce que le filtrage des comptes ?

Le filtrage des comptes vous permet de **choisir quels comptes bancaires inclure** dans vos calculs budgétaires et métriques financières.

Par défaut, Harena analyse uniquement vos **comptes courants** et **cartes bancaires** pour vous donner une vision précise de vos dépenses courantes, sans mélanger avec votre épargne ou vos investissements.

---

## 📱 Où trouver cette fonctionnalité ?

### 1. **Dashboard** - Visualiser les comptes utilisés

Sur votre dashboard, vous verrez une carte affichant :
- La liste de tous les comptes inclus dans vos calculs
- Le solde total de ces comptes
- Un bouton "Configurer" pour modifier vos préférences

### 2. **Page Configuration** - Modifier la sélection

Allez dans **Configuration → Comptes bancaires** et descendez jusqu'à la section **"Filtrage des comptes"**.

### 3. **Page Budget** - Badge d'information

Dans votre profil budgétaire, un badge discret vous indique combien de comptes sont utilisés.

### 4. **Page Métriques** - Badge d'information

Sur la page des métriques, un badge en haut vous rappelle sur combien de comptes les calculs sont basés.

---

## ⚙️ Comment configurer le filtrage ?

### Étape 1 : Accéder aux paramètres

1. Cliquez sur **Configuration** dans le menu
2. Sélectionnez l'onglet **Comptes bancaires**
3. Descendez jusqu'à la section **"Filtrage des comptes"**

### Étape 2 : Choisir votre mode de sélection

Vous avez **3 options** :

#### 🟢 Option 1 : Tous les comptes éligibles (par défaut)

**Quand l'utiliser ?**
- Vous voulez inclure tous vos comptes courants ET toutes vos cartes bancaires
- C'est le mode le plus simple et recommandé pour la plupart des utilisateurs

**Ce qui est inclus :**
- ✅ Tous vos comptes courants (checking)
- ✅ Toutes vos cartes bancaires (card)
- ❌ Comptes épargne (exclus automatiquement)
- ❌ Prêts (exclus automatiquement)
- ❌ Investissements (exclus automatiquement)

#### 🟡 Option 2 : Exclure certains types

**Quand l'utiliser ?**
- Vous voulez exclure SOIT les comptes courants, SOIT les cartes bancaires
- Exemple : "Je veux analyser uniquement mes comptes courants, sans les cartes"

**Comment configurer :**
1. Sélectionnez "Exclure certains types"
2. Cochez le type à exclure :
   - ☐ Exclure les comptes courants → Garde uniquement les cartes
   - ☐ Exclure les cartes bancaires → Garde uniquement les comptes courants

#### 🔵 Option 3 : Comptes spécifiques

**Quand l'utiliser ?**
- Vous voulez un contrôle total sur les comptes inclus
- Exemple : "Je veux analyser seulement 2 comptes sur les 5 que je possède"

**Comment configurer :**
1. Sélectionnez "Comptes spécifiques"
2. Une liste de tous vos comptes éligibles apparaît
3. Cochez les comptes que vous voulez inclure
4. Le compteur indique combien vous en avez sélectionnés

### Étape 3 : Sauvegarder

1. Cliquez sur le bouton **"Enregistrer"** (il s'active dès que vous faites une modification)
2. Une notification confirme que vos préférences ont été sauvegardées
3. Toutes vos métriques et calculs budgétaires sont immédiatement mis à jour !

---

## 🔄 Réinitialiser aux valeurs par défaut

Si vous voulez revenir à la configuration initiale :

1. Cliquez sur le bouton **"Réinitialiser"** en bas à gauche
2. Confirmez l'action
3. Le mode "Tous les comptes éligibles" est rétabli

---

## 💡 Questions fréquentes

### ❓ Pourquoi mon compte épargne n'apparaît pas dans les options ?

**Réponse :**
Harena exclut automatiquement les comptes épargne, prêts et investissements pour vous donner une analyse précise de vos **dépenses courantes**. Seuls les comptes courants et cartes bancaires peuvent être sélectionnés.

### ❓ Que se passe-t-il si j'exclus tous mes comptes ?

**Réponse :**
Vous pouvez le faire, mais vos calculs budgétaires seront basés sur 0 compte. Il est recommandé de garder au moins un compte pour avoir des analyses pertinentes.

### ❓ Puis-je sélectionner différents comptes pour différentes analyses ?

**Réponse :**
Non, actuellement la sélection s'applique à **toutes** les analyses :
- Profil budgétaire
- Métriques financières (YoY, MoM, Coverage, etc.)
- Détection des charges fixes
- Analyses de l'IA

### ❓ Les modifications sont-elles instantanées ?

**Réponse :**
Oui ! Dès que vous sauvegardez, tous vos calculs sont mis à jour et basés sur la nouvelle sélection de comptes.

### ❓ Puis-je revenir en arrière si je fais une erreur ?

**Réponse :**
Absolument ! Vous pouvez :
- Changer votre sélection à tout moment
- Cliquer sur "Réinitialiser" pour revenir aux valeurs par défaut

---

## 🎨 Comprendre les badges et indicateurs

### Badge "X comptes"

Vous verrez ce badge à plusieurs endroits :

- **Badge avec ✅** : Tous les comptes éligibles sont inclus (mode par défaut)
- **Badge avec ⚠️** : Vous avez appliqué un filtre (certains comptes sont exclus)

### Tooltip informatif

En passant votre souris sur l'icône **ℹ️** à côté du badge, vous verrez :
- Le mode de sélection actuel
- Une explication de la whitelist (checking + card uniquement)
- Le nombre de comptes utilisés vs éligibles

---

## 📊 Impact sur vos analyses

### Ce qui change quand vous modifiez les comptes

✅ **Mis à jour automatiquement :**
- Profil budgétaire (segment, pattern comportemental)
- Taux d'épargne
- Revenus et dépenses moyens
- Détection des charges fixes
- Toutes les métriques (YoY, MoM, Coverage, etc.)
- Analyses de l'IA conversationnelle

❌ **Non affecté :**
- Vos transactions (elles restent toutes en base de données)
- Vos connexions bancaires
- L'historique complet

### Exemple pratique

**Situation initiale :**
- 2 comptes courants : 1000€ et 500€
- 1 carte bancaire : -200€
- 1 compte épargne : 5000€
- **Comptes analysés** : 3 (courants + carte) = 1300€ total

**Après exclusion de la carte :**
- **Comptes analysés** : 2 (courants uniquement) = 1500€ total
- Vos métriques de dépenses vont diminuer (la carte n'est plus comptée)
- Votre taux d'épargne peut changer

---

## 🔐 Sécurité et confidentialité

- ✅ Vos préférences sont stockées de manière sécurisée
- ✅ Seul vous pouvez voir et modifier vos paramètres
- ✅ Les comptes exclus restent synchronisés et sécurisés
- ✅ Aucune donnée n'est supprimée, juste filtrée dans les calculs

---

## 🛠️ Support

### Problèmes courants

**"Le bouton Enregistrer est grisé"**
→ Vous n'avez fait aucune modification. Changez le mode ou la sélection.

**"Je ne vois pas la section Filtrage des comptes"**
→ Assurez-vous d'avoir au moins un compte bancaire connecté.

**"Mes modifications ne sont pas sauvegardées"**
→ Vérifiez votre connexion internet et réessayez.

---

## 📖 Ressources supplémentaires

- **Documentation technique** : `ACCOUNT_FILTERING_FRONTEND.md`
- **Scénarios de test** : `TESTING_SCENARIOS.md`
- **Documentation backend** : `ACCOUNT_FILTERING_IMPLEMENTATION.md`

---

**Bon usage de Harena ! 🚀**

*Dernière mise à jour : 2025-10-29*
