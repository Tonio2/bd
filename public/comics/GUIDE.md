# 📖 Guide d'utilisation - Lecteur de BD Immersif

## 🚀 Démarrage

### Première utilisation

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

3. **Ouvrir votre navigateur**
   
   Allez sur `http://localhost:5173/`

## 🎨 Interface

### Page d'accueil

La page d'accueil affiche une galerie de vos bandes dessinées :
- **Survolez** une couverture pour voir une prévisualisation
- **Cliquez** sur une couverture pour ouvrir la BD

### Lecteur de BD

Une fois une BD ouverte, vous êtes en mode lecture immersive :

#### Navigation
- **Zone gauche de l'écran** : Page précédente
- **Zone droite de l'écran** : Page suivante
- **Flèche ←** : Page précédente
- **Flèche →** : Page suivante
- **Espace** : Page suivante
- **Esc** : Fermer et retourner à la galerie

#### Boutons
- **X (en haut à droite)** : Fermer la BD
- **Icône plein écran (en bas à droite)** : Mode plein écran
- **F** : Raccourci plein écran

#### Compteur de pages
En bas au centre, vous verrez le numéro de page actuel (ex: "3 / 6")

## ➕ Ajouter vos propres BD

### Étape 1 : Préparer les images

1. Créez un dossier dans `public/comics/` avec le nom de votre BD (en minuscules, sans espaces)
   ```
   public/comics/ma-super-bd/
   ```

2. Ajoutez vos images dans ce dossier :
   - `cover.jpg` ou `cover.svg` - La couverture
   - `1.jpg`, `2.jpg`, `3.jpg`, etc. - Les pages

**Recommandations pour les images :**
- Format recommandé : **JPG** ou **WebP** pour les pages réelles
- Ratio recommandé : **2:3** (par exemple 1200x1800 pixels)
- Taille fichier : **< 500 Ko** par page pour des performances optimales
- Utilisez des noms de fichiers simples : `1.jpg`, `2.jpg`, etc.

### Étape 2 : Mettre à jour comics.json

Éditez le fichier `src/data/comics.json` et ajoutez votre BD :

```json
{
  "id": "ma-super-bd",
  "title": "Ma Super BD",
  "author": "Votre Nom",
  "description": "Une histoire épique de...",
  "coverImage": "/comics/ma-super-bd/cover.jpg",
  "pages": [
    {
      "number": 1,
      "image": "/comics/ma-super-bd/1.jpg",
      "alt": "Page 1 - Description"
    },
    {
      "number": 2,
      "image": "/comics/ma-super-bd/2.jpg",
      "alt": "Page 2 - Description"
    }
    // Ajoutez toutes vos pages...
  ],
  "totalPages": 24,
  "publishDate": "2024-12",
  "tags": ["aventure", "fantasy", "drame"],
  "metadata": {
    "width": 1200,
    "height": 1800,
    "aspectRatio": "2:3"
  }
}
```

### Étape 3 : Tester

Rechargez votre navigateur, votre BD devrait apparaître dans la galerie !

## 🎨 Personnalisation

### Changer les couleurs

Éditez `tailwind.config.js` :

```javascript
colors: {
  dark: {
    900: '#0a0a0a',  // Fond principal
    800: '#1a1a1a',  // Fond secondaire
    700: '#2a2a2a',
  },
  accent: {
    gold: '#d4af37',  // Couleur d'accent principale
    blue: '#4a90e2',  // Couleur secondaire (optionnelle)
  }
}
```

### Changer les polices

Éditez `tailwind.config.js` :

```javascript
fontFamily: {
  sans: ['Votre-Police', 'system-ui', 'sans-serif'],
  display: ['Votre-Police-Titre', 'serif'],
}
```

N'oubliez pas d'ajouter l'import de la police dans `src/index.css`.

### Modifier la vitesse d'animation

Éditez `src/data/comics.json` :

```json
"settings": {
  "defaultPageTurnDuration": 800,  // Durée en millisecondes (800ms par défaut)
  "enableSoundEffects": true
}
```

## 📦 Déploiement

### Build de production

```bash
npm run build
```

Cela génère un dossier `dist/` avec votre site optimisé.

### Déployer sur Vercel

1. **Via CLI**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Via interface web**
   - Allez sur [vercel.com](https://vercel.com)
   - Importez votre dépôt GitHub
   - Vercel détecte automatiquement Vite
   - Cliquez sur Deploy

### Déployer sur Netlify

1. **Via Drag & Drop**
   - Allez sur [netlify.com](https://netlify.com)
   - Glissez-déposez le dossier `dist/`

2. **Via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

## 🐛 Dépannage

### Les images ne s'affichent pas

- Vérifiez que les chemins dans `comics.json` correspondent aux fichiers dans `public/comics/`
- Les chemins doivent commencer par `/comics/...`
- Vérifiez la console du navigateur (F12) pour les erreurs

### Le build échoue

- Supprimez `node_modules/` et relancez `npm install`
- Vérifiez que toutes les dépendances sont installées
- Consultez les erreurs dans la console

### Les animations sont lentes

- Réduisez la taille de vos images (< 500 Ko par page)
- Utilisez le format WebP au lieu de JPG
- Vérifiez les performances de votre GPU

### Le son ne fonctionne pas

- Les navigateurs bloquent l'audio automatique
- Interagissez d'abord avec la page (cliquez quelque part)
- Vérifiez que `enableSoundEffects` est `true` dans `comics.json`

## 💡 Astuces

1. **Images placeholder** : Les images SVG générées servent d'exemple. Remplacez-les par vos vraies BD !

2. **Performance** : Pour de meilleures performances, optimisez vos images :
   ```bash
   # Installer imagemagick
   convert input.jpg -quality 85 -resize 1200x1800 output.jpg
   ```

3. **Format WebP** : Meilleur compression que JPG
   ```bash
   convert input.jpg -quality 80 output.webp
   ```

4. **Batch processing** : Pour convertir toutes vos images d'un coup :
   ```bash
   for file in *.jpg; do
     convert "$file" -quality 85 -resize 1200x1800 "optimized_$file"
   done
   ```

## 📞 Support

- Documentation Vite : https://vitejs.dev
- Documentation React Three Fiber : https://docs.pmnd.rs/react-three-fiber
- Documentation Framer Motion : https://www.framer.com/motion

Bon lecture ! 📖✨
