# Architecture du système de livre réaliste

## 🎯 Concept

Au lieu d'un fondu entre les spreads, on simule un **vrai livre** avec :
- Pages empilées les unes sur les autres
- Chaque page physique a un **recto** (face visible) et un **verso** (face cachée)
- Les pages pivotent sur l'axe de la reliure pour se retourner
- Les pages en dessous sont révélées progressivement

## 📚 Modèle de données

### Configuration des pages

Pour 6 pages de BD, voici comment elles sont organisées dans un vrai livre :

```
Spread 0 (ouverture 1):
├─ Page gauche: Page 1 (recto) | Page 2 (verso, caché)
└─ Page droite: Page 2 (recto) | Page 3 (verso, caché)

Spread 1 (ouverture 2):
├─ Page gauche: Page 3 (recto) | Page 4 (verso, caché)
└─ Page droite: Page 4 (recto) | Page 5 (verso, caché)

Spread 2 (ouverture 3):
├─ Page gauche: Page 5 (recto) | Page 6 (verso, caché)
└─ Page droite: Page 6 (recto) | vide (verso)
```

## 🔄 Animation de tournage

### Tourner vers l'avant (→)

Quand on est sur Spread 0 (pages 1-2) et qu'on va vers la droite :

**État initial :**
```
[Page 1 (gauche)] [Page 2 (droite)]
Dessous : [Page 3] [Page 4]
```

**Pendant l'animation (rotation de 0° à 180°) :**
```
[Page 1 (gauche)] [Page 2 en rotation ↻]
                   ↓ On commence à voir le verso (Page 3)
[Page 3 apparaît] [Page 4 dessous]
```

**État final (après rotation complète) :**
```
[Page 3 (gauche)] [Page 4 (droite)]
(Page 2 est maintenant complètement retournée, cachée derrière)
```

### Tourner vers l'arrière (←)

**Animation inverse** : la page gauche pivote de 0° à -180°

## 🏗️ Architecture des composants

### BookPage.jsx

Composant représentant une **page physique** du livre.

**Props :**
- `frontImageUrl` : Texture du recto
- `backImageUrl` : Texture du verso
- `rotationY` : Angle de rotation actuel (0 à π)
- `side` : 'left' ou 'right' (détermine l'axe de pivot)
- `zIndex` : Ordre d'empilement (pages du dessus = zIndex élevé)

**Fonctionnement :**
```javascript
// Pivot sur le bord de la reliure
const pivotX = side === 'right' ? -1.2 : 1.2;

// La page pivote autour de son bord
<group position={[pivotX, 0, z]}>
  <group rotation={[0, rotationY, 0]}>
    {/* Recto et verso */}
  </group>
</group>
```

### Book.jsx

Composant gérant l'**ensemble du livre** et la logique d'empilement.

**État des pages selon la situation :**

1. **Aucune animation** : Affiche le spread courant (2 pages)
2. **Tournage avant** : 
   - Page droite en rotation (zIndex élevé)
   - Pages du spread suivant visibles dessous (zIndex bas)
3. **Tournage arrière** :
   - Page gauche en rotation (zIndex élevé)
   - Pages du spread précédent visibles dessous (zIndex bas)

**Code clé :**
```javascript
// Page en cours de rotation a le zIndex le plus élevé
zIndex={isAnimating ? 10 : 5}

// Pages dessous sont visibles avec zIndex bas
zIndex={1}
```

### ComicBook.jsx

Composant orchestrant l'**animation** et les **contrôles**.

**Timeline d'animation :**
```
0ms     : turnProgress = 0 (page plate)
500ms   : turnProgress = 0.5 (page à 90°, perpendiculaire)
1000ms  : turnProgress = 1 (page complètement retournée à 180°)
```

## 🎨 Détails visuels

### Épaisseur du papier
Chaque page a une **tranche visible** (edge) :
```javascript
<planeGeometry args={[0.002, 3.6]} />  // 2mm d'épaisseur
```

### Recto vs Verso
- **Recto** : `position z = +0.001`
- **Verso** : `position z = -0.001`, `rotation Y = π`
- Décalage léger pour éviter le z-fighting

### Ordre de rendu (zIndex)
```
Z = 10  : Page en rotation (visible au-dessus)
Z = 5   : Pages statiques du spread actuel
Z = 1   : Pages du spread dessous/dessus
Z = 0   : Reliure
```

## 🚀 Améliorations possibles

### Courbure pendant la rotation
Actuellement : rotation plane (flat)
Possible : ajouter une légère courbure pour simuler la flexibilité du papier

```javascript
// Dans BookPage.jsx, remplacer planeGeometry par une géométrie courbée
const curvedGeometry = new THREE.CylinderGeometry(
  radius, radius, height, segments, 1, true, 0, Math.PI
);
```

### Ombres portées
Ajouter des ombres des pages sur les pages en dessous :
```javascript
<directionalLight castShadow />
<mesh receiveShadow castShadow>
```

### Son différent selon la direction
```javascript
const soundForward = '/sounds/page-turn-forward.mp3';
const soundBackward = '/sounds/page-turn-backward.mp3';
```

## 📊 Performance

- **Pages chargées** : Spread actuel + spread suivant/précédent = max 8 textures
- **Pages rendues** : 2 à 4 pages selon l'animation
- **Optimisation** : Lazy loading des textures éloignées

## 🐛 Debug

Pour visualiser la structure :
```javascript
// Dans Book.jsx, ajouter :
console.log('Current spread:', currentSpread);
console.log('Pages visible:', {
  left: leftPageIndex,
  right: rightPageIndex,
  next: nextLeftPageIndex, nextRightPageIndex,
  prev: prevLeftPageIndex, prevRightPageIndex
});
```

---

Cette architecture donne un **effet de livre beaucoup plus réaliste** sans aucun fondu ! 📖✨
