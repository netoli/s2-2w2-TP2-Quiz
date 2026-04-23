# Quiz de culture générale

Questionnaire interactif à 9 questions avec formulaire d'identification, système de score, feedback sonore et curseur personnalisé. Projet réalisé dans le cadre du TP2 du cours **582-2w2** (Collège de Maisonneuve, programme TIM).

**Démo live** : https://netoli.github.io/s2-2w2-TP2-Quiz/

---

## Ce que le projet démontre

- **JavaScript vanilla (ES2020+)** avec `'use strict';` et `defer` — pas de framework.
- **Gestion d'état simple** : navigation multi-étapes (accueil → formulaire → questionnaire → résultat) via masquage/affichage de sections.
- **Persistance locale** : `localStorage` pour sauvegarder les informations de l'utilisateur et les restaurer au rechargement.
- **Animations CSS** : transition circulaire à l'arrivée sur chaque étape, fondus latéraux sur les questions révélées au scroll, curseur personnalisé suivant la souris via variables CSS.
- **Accessibilité** : fieldsets/legends pour les groupes radio, labels explicites, focus visible au clavier, fallback automatique au curseur système sur tactile et pour `prefers-reduced-motion`.
- **Performance** : polices Google préconnectées, images en `loading="lazy"`, sons en `preload="none"` déverrouillés au premier geste utilisateur (conforme aux politiques autoplay modernes).

## Stack

| Couche | Technologie |
|---|---|
| Structure | HTML5 sémantique (`<main>`, `<section>`, `<fieldset>`, `<legend>`) |
| Style | CSS3 (variables custom, `backdrop-filter`, `clamp()`, animations, media queries) |
| Comportement | JavaScript ES2020+ avec `'use strict';` + `defer` |
| Typographie | Google Fonts — Kantumruy Pro + Raleway (préchargées) |
| Déploiement | GitHub Pages |

## Structure

```
s2-2w2-TP2-Quiz-main/
├── index.html                 # structure sémantique + SEO/OG
├── assets/
│   ├── css/style.css          # styles + variables + responsive + a11y
│   ├── js/index.js            # script classique `defer` + `'use strict';` (navigation, validation, score, a11y)
│   ├── images/                # drapeaux, animaux, personnages, icônes curseur
│   └── sons/                  # succes.mp3, echec.mp3
└── README.md
```

## Choix techniques notables

- **Curseur personnalisé décoratif** (`.curseur` avec variables `--mouse-x`/`--mouse-y`) mais **fallback automatique** au curseur système sur écrans tactiles (`@media (pointer: coarse)`) et pour les utilisateurs ayant activé `prefers-reduced-motion` — le design n'empêche jamais la navigation.
- **Déverrouillage audio** : depuis Chrome 66, `Audio.play()` avant tout geste utilisateur est bloqué. J'unlock les deux pistes au premier `pointerdown`/`keydown` en les jouant brièvement muted.
- **Score calculé à partir du DOM** : `querySelector('input[name="qN"]:checked')` plutôt que de maintenir un objet d'état séparé — simple et robuste pour 9 questions.
- **Résultats injectés sans `innerHTML`** sur le nom de l'utilisateur — `textContent` + `createElement` pour éviter toute injection XSS via le formulaire.

## Améliorations apportées (sprint R9 — avril 2026)

Avant ce sprint, le projet était dans son état de remise scolaire. Améliorations intégrées :

- `<html lang="fr-CA">` (au lieu de `lang="en"` sur contenu français).
- Correction de typos dans les questions (Q2 date, Q5 formulation, Q6 « ministre », Q7 « millilitres », Q9 « pionnier »).
- Correction de labels cassés : `id="d1500_q7"` vs `for="1500_q7"` (clic impossible) et `for="romains_Q9"` vs `id="romains_q9"` (casse).
- Migration de 5 `<main>` empilés (erreur HTML5 : un seul `<main>` autorisé par page) vers un `<main>` unique contenant 5 `<section>`.
- Groupes radio (`sexe`, `q1`-`q9`) encapsulés dans `<fieldset>`/`<legend>`.
- Sélecteurs « Occupation » / « Niveau d'étude » : placeholder désormais `<option value="" disabled selected>` (ne peut plus être soumis par erreur).
- `<button type="button">` au lieu de `<div class="bouton">` (focusable au clavier, activable par Entrée/Espace).
- Focus visible (`:focus-visible` avec outline contrasté).
- Restauration du curseur natif sur tactile + `prefers-reduced-motion`.
- JS en strict mode explicite (`'use strict';`) avec chargement `defer` — compatible `file://` sans serveur ; implicit global `uneLettre` corrigé, variable `sufaceGlobale` → `surfaceGlobale`.
- Audio `preload="none"` + déverrouillage au premier geste.
- Pré-remplissage du formulaire depuis `localStorage` au chargement.
- Métadonnées SEO + Open Graph + `preconnect` Google Fonts + réduction à 2 familles (au lieu de 3).
- Images en `loading="lazy"` avec dimensions intrinsèques.
- Rendu des résultats via `textContent`/`createElement` (protection contre l'injection HTML via le nom).

## Limites connues / pistes d'itération

- Le flux détruit les boutons du footer avec `.remove()` en avançant dans les étapes — un état UX sans retour arrière possible (rechargement obligatoire). À réarchitecturer si ré-utilisation en production.
- Les images (drapeaux, animaux, personnages) sont en JPG ; conversion en WebP/AVIF à planifier pour gagner ~30-60 % en poids.
- Refactor complet en modules ES séparés (`state.js`, `navigation.js`, `quiz.js`, `audio.js`) non réalisé : choix conservateur pour ne pas casser la mécanique à 9 questions. Priorité basse.

## Lancer en local

Aucun build, aucune dépendance. Un simple serveur statique suffit :

```bash
# Python 3
python3 -m http.server 8000
# ou Node
npx serve .
```

Puis ouvrir http://localhost:8000.

## Auteur

**Olivier Vernet** — TIM, Collège de Maisonneuve — [@netoli](https://github.com/netoli)
Professeur : Vincent Leblanc.
