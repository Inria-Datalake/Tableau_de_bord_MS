# 📊 Tableau de bord des Copublications Inria

Tableau de bord interactif des copublications scientifiques Inria, déployé sur GitHub Pages.

🔗 **URL du dashboard** : [https://inria-datalake.github.io/Tableau_de_bord_MS/](https://inria-datalake.github.io/Tableau_de_bord_MS/)

---

## 📁 Structure des fichiers

```
docs/
│
├── index.html             ← Page d'entrée principale du dashboard
│                            (ne pas modifier sauf pour changer le titre)
│
├── 404.html               ← Page de redirection automatique
│                            (redirige /Tableau_de_bord_MS/ vers /#/)
│                            Ne pas supprimer — nécessaire pour GitHub Pages
│
├── datalake-logo.png      ← Logo affiché dans l'en-tête et l'onglet du navigateur
│                            Remplacer ce fichier pour changer le logo
│
├── data/
│   └── publications.json  ← ⭐ FICHIER DE DONNÉES PRINCIPAL
│                            Contient les 1 871 entrées de copublications
│                            C'est ici que vous mettez à jour les données
│
└── assets/
    ├── inria-dashboard-app.js     ← Application principale (code du dashboard)
    ├── inria-dashboard-styles.css ← Styles visuels (couleurs, mise en page)
    ├── inria-charts-lib.js        ← Bibliothèque de graphiques (Recharts)
    ├── inria-vendor-libs.js       ← Bibliothèques tierces (React, etc.)
    ├── inria-utils.js             ← Utilitaires internes
    ├── inria-leaflet-core.js      ← Carte géographique (Leaflet)
    ├── inria-html2canvas.js       ← Export en image PNG
    ├── inria-jspdf.js             ← Export en PDF
    └── inria-purify.js            ← Sécurité (nettoyage HTML)
```

> ⚠️ **Important** : Ne jamais modifier les fichiers `.js` et `.css` dans `assets/` manuellement — ils sont générés automatiquement. Seul `publications.json` doit être mis à jour régulièrement.

---

## 🔄 Mettre à jour les données

C'est la seule opération courante que vous aurez à faire.

### Étape 1 — Préparer le nouveau fichier de données

Votre fichier source est un fichier Excel (`.xlsx`) avec les colonnes suivantes :

| Colonne | Description |
|--------|-------------|
| `Hal_ID` | Identifiant unique de la publication dans HAL |
| `DocType_halinria` | Type de document (ART, CONF, POSTER…) |
| `Annee` | Année de publication |
| `Centre_inria` | Centre Inria de l'auteur |
| `Equipe_inria` | Équipe de recherche Inria |
| `Auteur_Inria` | Nom de l'auteur Inria |
| `Auteur_coauteur` | Nom du co-auteur |
| `Nom_org_copubliant` | Nom de l'organisme co-publiant |
| `Type_org_copubliant` | Type d'organisme (laboratory, institution…) |
| `Code_Pays_orgs_copubliant` | Code pays ISO (FR, US, DE…) |
| `Nom_Pays_org_copubliant` | Nom du pays |
| `UE/Hors_UE` | Indicateur UE ou Hors_UE |
| `Domaine_Hal` | Domaine HAL (ex: Computer Science) |
| `Domaine_inria` | Domaine Inria |
| `Mots_cles_Hal` | Mots-clés HAL |
| `Mots_cles_inria` | Mots-clés Inria |

### Étape 2 — Convertir Excel en JSON

Vous avez besoin de Python installé sur votre ordinateur.

1. Installez la dépendance si ce n'est pas fait :
   ```bash
   pip install openpyxl pandas
   ```

2. Créez un fichier `convert.py` avec ce contenu :
   ```python
   import pandas as pd
   import json

   # Remplacez par le nom de votre fichier Excel
   df = pd.read_excel("copublications_Inria_MS.xlsx", sheet_name="Sheet1")

   # Nettoyage : remplacer les valeurs manquantes par None
   df = df.where(pd.notnull(df), None)

   # Convertir en liste de dictionnaires
   data = df.to_dict(orient="records")

   # Sauvegarder en JSON
   with open("publications.json", "w", encoding="utf-8") as f:
       json.dump(data, f, ensure_ascii=False, indent=2)

   print(f"✅ {len(data)} publications exportées")
   ```

3. Lancez la conversion :
   ```bash
   python convert.py
   ```

4. Vous obtenez un fichier `publications.json` prêt à être uploadé.

### Étape 3 — Uploader sur GitHub

1. Allez sur votre repo : [https://github.com/Inria-Datalake/Tableau_de_bord_MS](https://github.com/Inria-Datalake/Tableau_de_bord_MS)
2. Naviguez dans **docs → data**
3. Cliquez sur `publications.json`
4. Cliquez sur l'icône **✏️ crayon** (Edit this file)
5. Cliquez sur **"Delete file"** pour supprimer l'ancien
6. Revenez dans **docs → data**, cliquez **"Add file" → "Upload files"**
7. Glissez-déposez votre nouveau `publications.json`
8. Cliquez **"Commit changes"**

Le dashboard se met à jour en quelques secondes automatiquement.

---

## 🖼️ Changer le logo

Le logo affiché dans l'en-tête du dashboard est le fichier `docs/datalake-logo.png`.

Pour le remplacer :
1. Préparez votre nouveau logo au format PNG (idéalement fond transparent, ~200px de large)
2. Nommez-le **exactement** `datalake-logo.png`
3. Dans GitHub, naviguez dans **docs/**
4. Cliquez sur **"Add file" → "Upload files"**
5. Uploadez votre nouveau logo — GitHub remplacera l'ancien automatiquement

---

## ⚙️ Configuration GitHub Pages

Ces paramètres doivent rester inchangés :

| Paramètre | Valeur |
|-----------|--------|
| Source | Deploy from a branch |
| Branch | `main` |
| Folder | `/docs` |

Pour vérifier : **Settings → Pages** dans votre repo GitHub.

---

## 🛠️ Reconstruire le dashboard (pour développeurs)

Si vous souhaitez modifier le code source du dashboard (couleurs, graphiques, filtres…), voici comment procéder.

### Prérequis
- [Node.js 18+](https://nodejs.org/) installé
- Git installé

### Installation

```bash
# Cloner le repo (partie code source — pas docs/)
git clone https://github.com/Inria-Datalake/Tableau_de_bord_MS.git
cd Tableau_de_bord_MS

# Installer les dépendances
npm install
```

### Structure du code source

```
src/
├── pages/
│   └── Dashboard.jsx      ← Page principale — modifier ici pour changer la mise en page
├── components/
│   ├── charts/            ← Chaque graphique est un fichier séparé
│   │   ├── PublicationsByYear.jsx   ← Graphique évolution annuelle
│   │   ├── HorizontalBarChart.jsx   ← Barres horizontales (pays, organismes…)
│   │   ├── DonutChart.jsx           ← Graphique donut (UE/Hors UE)
│   │   ├── ChoroplethMap.jsx        ← Carte mondiale
│   │   ├── NetworkGraph.jsx         ← Graphe de réseau de collaborations
│   │   ├── WordCloud.jsx            ← Nuage de mots-clés
│   │   └── RadarChartDomaines.jsx   ← Radar des domaines
│   └── dashboard/
│       ├── FilterSidebar.jsx        ← Panneau de filtres latéral
│       └── StatCard.jsx             ← Cartes de statistiques en haut
└── lib/
    └── dataProcessor.js   ← Toute la logique de calcul des statistiques
                              Modifier ici pour changer les agrégations
```

### Modifier les couleurs

Les couleurs principales sont dans `src/index.css` et dans chaque composant de graphique.

Pour changer la palette de couleurs d'un graphique, ouvrez le fichier correspondant dans `src/components/charts/` et modifiez le tableau `COLORS`.

### Lancer en local

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173) dans votre navigateur.

### Construire pour GitHub Pages

```bash
npm run build
```

Les fichiers générés sont dans `dist/` — copiez leur contenu dans `docs/`.

---

## ❓ Problèmes fréquents

### Le dashboard affiche une page blanche
→ Vérifiez que `docs/data/publications.json` n'est pas vide et contient bien un tableau JSON valide.

### L'URL `/Tableau_de_bord_MS/` donne une erreur 404
→ Vérifiez dans Settings → Pages que le dossier source est bien `/docs` (et non `/`).

### La carte ne s'affiche pas
→ Vérifiez que `docs/assets/inria-leaflet-core.js` est bien présent.

### Les données ne se mettent pas à jour après upload
→ Videz le cache de votre navigateur (Ctrl+Shift+R) ou attendez 2-3 minutes que GitHub Pages se régénère.

---

## 📬 Contact

Pour toute question sur ce dashboard, contactez l'équipe **Inria Datalake**.
