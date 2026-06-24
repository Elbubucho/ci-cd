# Integration Test

Application full-stack (React + FastAPI + MySQL) servant de support à une chaîne CI/CD complète : tests unitaires, intégration, end-to-end avec Cypress, infrastructure Docker, et déploiement automatisé sur AWS (registre Docker privé + EC2 applicative provisionnée via Terraform/Ansible).

## Stack

- **Frontend** : React 19, axios
- **Backend** : Python 3.9, FastAPI, uvicorn
- **Base de données** : MySQL 8.4
- **Adminer** : interface web pour la DB
- **Registre Docker privé** : registry:2 derrière nginx (TLS + htpasswd)
- **IaC** : Terraform (provisionning) + Ansible (configuration)
- **CI/CD** : GitHub Actions

## Pré-requis

- [Node.js](https://nodejs.org/) 20+
- [Docker](https://www.docker.com/) et Docker Compose
- [Terraform](https://www.terraform.io/) 1.2+ et [Ansible](https://www.ansible.com/) (uniquement pour exécuter le déploiement en local)
- npm

## Installation locale

```bash
git clone https://github.com/Elbubucho/ci-cd.git
cd integration-test
npm install
```

Créer un fichier `.env` à la racine

```
MYSQL_ROOT_PASSWORD=admin
MYSQL_USER=root
MYSQL_DATABASE=ynov_ci
```

## Lancer l'application en local

### Environnement complet avec Docker

```bash
docker compose up --build
```

- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- Adminer : http://localhost:8080

### Front seul

```bash
npm start
```

## Tests

### Unitaires et d'intégration

```bash
npm test
```

Suite Jest avec rapport de couverture dans `./coverage`.

### End-to-end (Cypress)

```bash
# Mode online (stack complète)
docker compose up -d
npx cypress open

# Mode offline (backend down)
docker compose up -d
docker compose stop backend
npx cypress open --env offline=true
```

## Documentation JSDoc

```bash
npm run jsdoc
```

Générée dans `./public/docs`.

## Déploiement AWS

L'architecture finale repose sur deux EC2 distinctes :

- Une **EC2 registre** hébergeant un registre Docker privé (nginx + TLS + htpasswd), déployée une fois et persistante.
- Une **EC2 applicative** éphémère, recréée à chaque exécution du workflow, qui pull les images depuis le registre et lance la stack complète.

Le déploiement se fait via le workflow `deploy.yml` (déclenché manuellement) :

1. Build et push des images frontend/backend vers le registre Docker privé.
2. `terraform apply` crée une nouvelle EC2 applicative.
3. Ansible configure cette EC2 et lance la stack en pullant les images depuis le registre.
4. Le workflow valide via `curl` que le frontend et le backend répondent, puis affiche les URLs publiques.

Les variables et secrets nécessaires sont à configurer dans GitHub Secrets (identifiants AWS, identifiants du registre, credentials MySQL).

## Structure du projet

```
.
├── .github/workflows/      # Pipelines CI/CD (tests, build, deploy)
├── ansible/                # Playbook de configuration de l'EC2 applicative
├── infra/                  # Terraform : EC2 applicative + clé SSH + SG
├── registry/               # Terraform + Ansible pour l'EC2 du registre Docker
├── server/                 # Backend FastAPI (main.py, Dockerfile, requirements.txt)
├── src/                    # Frontend React
├── sqlfiles/               # Migrations SQL
├── cypress/                # Tests end-to-end
├── docker-compose.yml      # Stack de développement (build local)
└── docker-compose.prod.yml # Stack de production (pull depuis le registre)
```
