# Integration Test

Application full-stack (React + FastAPI + MySQL) servant de support à la mise en place d'une chaîne CI/CD complète : tests unitaires, intégration, end-to-end avec Cypress, infrastructure Docker, déploiement automatisé sur GitHub Pages (front) et Vercel (back), DB de production sur AlwaysData.

## Stack

- **Frontend** : React 19, axios — déployé sur GitHub Pages
- **Backend** : Python 3.9, FastAPI, uvicorn — déployé sur Vercel
- **Base de données** : MySQL 9.7 (locale via Docker, prod sur AlwaysData)
- **Outils** : Adminer pour explorer la DB en local

## Pré-requis

- [Node.js](https://nodejs.org/) (version 20 ou supérieure)
- [Docker](https://www.docker.com/) et Docker Compose (pour l'environnement complet)
- npm

## Installation

```bash
git clone https://github.com/Elbubucho/ci-cd.git
cd integration-test
npm install
```

Créer un fichier `.env` à la racine :

```
MYSQL_ROOT_PASSWORD=admin
MYSQL_USER=root
MYSQL_DATABASE=ynov_ci
```

## Lancer l'application

### Tout l'environnement avec Docker

```bash
docker compose up --build
```

- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- Adminer : http://localhost:8080

### Front seul (sans Docker)

```bash
npm start
```

## Lancer les tests

### Tests unitaires et d'intégration

```bash
npm test
```

Exécute la suite Jest et génère un rapport de couverture dans `./coverage`.

### Tests end-to-end (Cypress)

```bash
# Mode online (backend up)
docker compose up -d
npx cypress open

# Mode offline (backend down)
docker compose up -d
docker compose stop backend
npx cypress open --env offline=true
```

## Générer la documentation

```bash
npm run jsdoc
```

La documentation est générée dans `./public/docs`.

## Déploiement

Les déploiements sont automatisés via GitHub Actions à chaque push sur `main` :

- **Frontend** → GitHub Pages
- **Backend** → Vercel
- **Images Docker** → Docker Hub

La DB de production tourne sur AlwaysData. Les secrets sont gérés via GitHub Secrets et les variables d'environnement Vercel.
