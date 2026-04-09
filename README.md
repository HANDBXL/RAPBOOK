# 🎤 Rap Illustration AR - Guide d'Installation

Cette application utilise la technologie **WebAR** (MindAR + A-Frame) pour transformer ton livre d'illustrations en expérience interactive.

## 🚀 Démarrage Rapide

### 1. Préparation des images cibles (Targets)
Pour que l'application reconnaisse tes pages, tu dois compiler tes illustrations dans un fichier `.mind`.
- Rends-toi sur l'outil en ligne : [MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile)
- Importe tes illustrations (une par une). L'ordre d'importation correspondra aux index `0, 1, 2...` dans `config.js`.
- Télécharge le fichier `targets.mind`.
- Place ce fichier dans le dossier `targets/` de ce projet.

### 2. Configuration du contenu
Ouvre le fichier `config.js` pour personnaliser chaque page :
- **youtubeId** : L'identifiant de la vidéo (ex: dans `youtube.com/watch?v=XXXXX`, l'ID est `XXXXX`).
- **lyrics** : Le texte des paroles.
- **gif** : Lien vers un GIF animé ou une image 2D flottante.
- **contentOffset** : Si c'est une double page avec une page blanche, règle `x: -1` pour que le contenu apparaisse sur la page de gauche.

### 3. Lancement local
Pour des raisons de sécurité liée à la caméra et aux modules JS, l'application doit être lancée via un serveur local :
- **Option A** : Utilise l'extension "Live Server" sur VS Code.
- **Option B** : Si tu as Node.js, lance `npx vite` dans le dossier.
- **Option C** : Héberge le dossier sur GitHub Pages ou Vercel (doit être en **HTTPS**).

## 🛠 Structure du projet
- `index.html` : Structure de la scène AR et de l'interface.
- `style.css` : Design "Light" (Glassmorphism, typographie).
- `main.js` : Logique de détection et boutons interactifs.
- `config.js` : Vos données personnalisées.
- `targets/` : Contient votre fichier de reconnaissance d'image.

## 💡 Conseils pour de meilleures performances
- Assure-toi que les illustrations ont de bons contrastes et des détails (évite les aplats de couleur trop larges).
- Utilise des fichiers GIF légers pour ne pas ralentir le chargement mobile.
- L'application fonctionne mieux sur Safari (iOS) ou Chrome (Android).
