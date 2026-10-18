# Site Aim Display

Site vitrine officiel d’Aim Display, un logiciel de gestion de compétitions de tir sportif.

## Technologies

- HTML
- CSS
- JavaScript

## Utilisation

Ouvrez `index.html` dans un navigateur. Aucun outil de compilation ni aucune dépendance ne sont nécessaires.

## Publication

Le site est prévu pour être publié avec GitHub Pages depuis la branche principale du dépôt.

## Structure

- `index.html` : page principale
- `styles.css` : styles du site
- `script.js` : interactions et animations
- `assets/` : logo, icônes et polices
- `assets/video/` : vidéo de présentation, son image d’aperçu et sa description (WebVTT)
- `assets/og-image.jpg` : image affichée lors du partage du site sur les réseaux sociaux
- `mentions-legales.html` : mentions légales
- `confidentialite.html` : politique de confidentialité
- `sitemap.xml`, `robots.txt`, `site.webmanifest`, `favicon.ico` : référencement et icônes

## Vidéo de présentation

La vidéo est générée par le projet Remotion `promo-video` du dépôt AimDisplay (`npm run render`). Elle est ensuite compressée pour le web avec ffmpeg (fourni par Remotion) :

```bash
ffmpeg -i out/aim-display-promo.mp4 -an -vf "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709,format=yuv420p" -c:v libx264 -preset veryslow -tune animation -crf 23 -profile:v high -level 4.0 -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv -movflags +faststart assets/video/aim-display-promo.mp4
ffmpeg -ss 2.5 -i assets/video/aim-display-promo.mp4 -frames:v 1 -q:v 3 assets/video/aim-display-promo-poster.jpg
```
## Auteur

Hugo Eribon
