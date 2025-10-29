# Corrections - Lecteur de BD Immersif

## Version corrigée (29 oct 2025)

### ✅ Problèmes résolus

#### 1. Images effacées / manque de luminosité
**Problème** : Les pages apparaissaient grisées ou ternies
**Solution** :
- Passage à `meshBasicMaterial` au lieu de `meshStandardMaterial` (pas d'ombres complexes)
- Suppression du tone mapping (`NoToneMapping`)
- Luminosité ambiante augmentée à 2.0
- Configuration correcte du `colorSpace` en SRGB

#### 2. Pages 1-2 invisibles au démarrage
**Problème** : Au premier chargement, seule la tranche du livre était visible
**Solution** :
- Chargement manuel des textures avec `THREE.TextureLoader` au lieu de `useTexture`
- Ajout d'un `Suspense` pour gérer le chargement asynchrone
- Délai d'ouverture augmenté à 1500ms pour laisser le temps aux textures de charger
- Vérification `if (!texture) return null` avant le rendu

#### 3. Animation de curl inversée
**Problème** : La page se pliait dans le mauvais sens (s'agrandissait au lieu de se rétrécir)
**Solution** :
- Algorithme de curl complètement réécrit
- Pour page droite : curl vers la gauche (`offsetX négatif`)
- Pour page gauche : curl vers la droite (`offsetX positif`)
- Z positif = vers le spectateur (bon sens)
- Limitation du curl à 70% de la page (30% reste fixe près de la reliure)

#### 4. Compteur de pages incorrect
**Problème** : Affichait "N/6" au lieu de "N/3"
**Solution** :
- Hook `usePageTurn` modifié pour gérer les "spreads" (paires de pages)
- Calcul : `totalSpreads = Math.ceil(totalPages / 2)`
- Navigation par spread au lieu de par page individuelle

### 🎨 Améliorations visuelles

- Numéros de page bien visibles (grande taille au centre)
- Éclairage simplifié pour plus de clarté
- Matériau basique pour des couleurs fidèles
- Rotation légère des pages (1.5°) pour effet livre ouvert réaliste

### 📐 Paramètres techniques

```javascript
// Géométrie
PlaneGeometry(2.4, 3.6, 60, 60) // 60x60 segments pour curl fluide

// Curl
curlRadius: 1.0
maxAngle: Math.PI * 0.6 (108°)
curlZone: 70% de la page depuis le bord libre

// Caméra
position: [0, 0, 7]
fov: 45

// Matériau
meshBasicMaterial (pas d'ombres)
toneMapped: false
```

### 🧪 Test

Pour tester les corrections :
1. Ouvrir http://localhost:5173/
2. Cliquer sur une BD
3. Attendre 1.5s → Les pages 1-2 doivent apparaître clairement
4. Cliquer à droite → Animation de curl de la page droite vers la gauche
5. Le compteur doit indiquer "1/3", "2/3", "3/3"

## Fichiers modifiés

- `src/components/Page3D.jsx` - Chargement texture + algorithme curl
- `src/components/PageTurnEffect.jsx` - Éclairage et scène 3D
- `src/components/ComicBook.jsx` - Navigation par spreads + délai chargement
- `src/hooks/usePageTurn.js` - Logique spreads au lieu de pages
- `public/comics/*/[1-6].svg` - Numéros de page visibles
