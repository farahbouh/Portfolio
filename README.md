<div align="center">

# Portfolio personnel

**Mon portfolio de développeuse Web : projets, compétences et parcours**

![Status](https://img.shields.io/badge/status-en%20ligne-brightgreen)
![Création](https://img.shields.io/badge/cr%C3%A9%C3%A9%20en-juillet%202026-blue)
![Dernière mise à jour](https://img.shields.io/github/last-commit/farahbouh/Portfolio?label=derni%C3%A8re%20mise%20%C3%A0%20jour)

![Python](https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-backend-000000?logo=flask)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-f7df1e?logo=javascript&logoColor=yellow)
![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow?logo=conventionalcommits)

[Démo en ligne](https://farahbouh.netlify.app/) · [Installation](#mise-en-place) · [Signaler un bug](../../issues)

<img src="images/demo.png" width="700" alt="Aperçu du portfolio">

</div>

---

## Pourquoi ce projet ?

Présenter, au-delà de mon CV, mes projets et mes compétences de façon plus ludique.

---

## Stack technique

| | |
|---|---|
| **Frontend** | HTML, CSS, JavaScript |
| **Backend** | Python, Flask |
| **Données** | Fichiers JSON (`data/projets.json`, `data/competences.json`), éditables sans toucher au code |
| **Formulaire de contact** | Formspree |

__*Pourquoi cette stack* ?__

D'abord parce qu'elle s'appuie sur ce que je maîtrise déjà (HTML, CSS, Python).
Le but était d'apprendre à utiliser Python dans une interface web et de découvrir plus en profondeur JavaScript et JSON.

__Côté technique__ : pas de framework front (le site reste simple), Flask (peu de routes), du JSON plutôt qu'une base de données pour garder le contrôle sur les données et Formspree pour éviter de gérer un backend d'email.

---

## Fonctionnalités

- Parcourir mes projets et les filtrer par compétence
- Afficher les médias disponibles d'un projet (vidéo, documentation…) et masquer les badges correspondants quand ils n'existent pas (automatique)
- Consulter mes compétences (défilement animé) et ma page À propos
- Me contacter via un formulaire
- Naviguer sur téléphone ou ordinateur, avec animations au scroll et effet machine à écrire sur l'accueil
---

## Mise en place

Il vous faut Python 3.

**Windows (PowerShell) :**

```powershell
git clone https://github.com/farahbouh/Portfolio.git
cd Portfolio
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

**Linux / macOS :**
```bash
git clone https://github.com/farahbouh/Portfolio.git
cd Portfolio
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

Ouvrez http://localhost:5000 et c'est prêt.

<details>
<summary>Structure du projet</summary>

```bash
.
├── data
│   ├── competences.json
│   └── projets.json
├── images
│   └── demo.png
├── scripts
│   ├── competences.js
│   ├── contact.js
│   └── projets.js
├── static
│   ├── videos
│   └── CV_Farah_Bouhnaida.pdf
├── styles
│   └── style.css
├── 404.html
├── README.md
├── app.py
├── apropos.html
├── contact.html
├── index.html
├── merci.html
├── projets.html
└── requirements.txt
```

</details>

<details>
<summary>Ajouter un projet</summary>

Ajoutez une entrée dans `data/projets.json` : la page Projets et le filtre par compétence se mettent à jour automatiquement.

</details>

<details>
<summary>Un problème au lancement ?</summary>

- **Port déjà utilisé** : définissez une autre valeur, par exemple `PORT=5001 python app.py`.
- **Module introuvable** : vérifiez que l'environnement virtuel est activé et relancez `pip install -r requirements.txt`.

</details>

---

## Ce que ce projet m'a appris

- Structurer une application Flask (routes, templates Jinja, gestion de la 404)
- Utiliser un fichier JSON pour stocker les données
- Charger et filtrer dynamiquement du contenu en JavaScript
- Suivre les Conventional Commits tout au long du projet

---
## Contribuer

Les idées et retours sont les bienvenus : n'hésitez pas à ouvrir un [ticket](../../issues).

---

## Licence

Le code de ce projet est sous licence [MIT](LICENSE).  
Les contenus (textes, images, projets présentés) sont sous [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.fr) réutilisables à des fins non commerciales avec attribution.

---

<div align="center">

Réalisé par [Farah](https://github.com/farahbouh) 

Contact : [LinkedIn](https://www.linkedin.com/in/farahbouh) · [Email](mailto:farah.bouhnaida@gmail.com)

</div>