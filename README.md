# Integration Test

Petit projet React servant de support à la mise en place d'une chaîne d'intégration continue (CI/CD) : tests automatisés, génération de documentation JSDoc et déploiement via GitHub Pages.

## Pré-requis

- [Node.js](https://nodejs.org/) (version 18 ou supérieure recommandée)
- npm (installé avec Node.js)

## Installation

Cloner le dépôt puis installer les dépendances :

```bash
git clone https://github.com/Elbubucho/ci-cd.git
cd integration-test
npm install
```

## Lancer l'application

```bash
npm start
```

L'application est ensuite accessible sur [http://localhost:3000](http://localhost:3000).

## Lancer les tests

```bash
npm test
```

Cette commande exécute la suite de tests et génère un rapport de couverture.

## Générer la documentation

```bash
npm run jsdoc
```

La documentation est générée dans `./public/docs`.
