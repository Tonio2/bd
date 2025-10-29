# 📚 Lecteur de BD Immersif

Un lecteur de bandes dessinées web immersif avec effet 3D de page tournée réaliste.

## ✨ Fonctionnalités

- 🎨 **Galerie élégante** : Présentation des BD avec effets de survol fluides
- 📖 **Lecture 3D immersive** : Effet de page tournée réaliste avec Three.js
- 🎯 **Navigation intuitive** : Clic gauche/droite ou touches clavier
- 🔊 **Effets sonores** : Son de page tournée pour plus d'immersion
- 🖥️ **Mode plein écran** : Lecture sans distraction
- 📱 **Responsive** : Fonctionne sur desktop et mobile
- ⚡ **Performances optimisées** : Chargement rapide et animations fluides

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Développement
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:5173/`

### Build production
```bash
npm run build
```

## 🎮 Contrôles

### Clavier
- `←` / `→` : Navigation entre les pages
- `Espace` : Page suivante
- `F` : Plein écran
- `Esc` : Fermer la BD

### Souris
- **Clic gauche de l'écran** : Page précédente
- **Clic droit de l'écran** : Page suivante

## 📦 Ajouter vos propres BDs

1. Placez vos images dans `public/comics/nom-de-la-bd/`
2. Mettez à jour `src/data/comics.json`

## 🛠️ Technologies

- React 18 + Vite
- Three.js + React Three Fiber
- Framer Motion
- TailwindCSS

## 🚀 Déploiement

Le projet est compatible Vercel, Netlify, et tout hébergement statique.

---

Fait avec ❤️ et Claude Code
