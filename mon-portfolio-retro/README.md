# Portfolio Retro - Louis Le Gouge

Lien du site https://portefolio-iota-six.vercel.app/

Portfolio personnel avec un design rétro inspiré des terminaux classiques.

## Description

Ce projet est un portfolio interactif développé avec React (frontend) et Symfony (backend). Il présente mes projets, compétences, parcours professionnel et permet aux visiteurs de me contacter via un formulaire.

## Fonctionnalités

### Frontend
- Design rétro avec effets CRT, scanlines et animations néon
- Page d'accueil avec présentation personnelle
- Section projets avec modal détaillé et carousel d'images
- Timeline du parcours professionnel
- Affichage des compétences avec barres de progression animées
- Formulaire de contact fonctionnel
- Écran de chargement terminal-style
- Navigation responsive avec menu burger
- Panneau d'administration sécurisé

### Backend
- API REST développée avec Symfony
- Authentification sécurisée par session
- Gestion des messages de contact
- CRUD complet pour projets, timeline, compétences et icônes tech
- Base de données MySQL
- Protection des routes admin

## Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- PHP 8.1 ou supérieur
- Composer
- MySQL 5.7 ou supérieur
- Symfony CLI (recommandé)

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd mon-portfolio-retro
```

### 2. Installation du Frontend

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le frontend sera accessible à l'adresse : `http://localhost:3000`

### 3. Installation du Backend

```bash
cd backend

# Installer les dépendances PHP
composer install

# Configurer la base de données
# Éditer le fichier .env et modifier la ligne DATABASE_URL
DATABASE_URL="mysql://root:@127.0.0.1:3306/portfolio_db"

# Créer la base de données
php bin/console doctrine:database:create

# Exécuter les migrations
php bin/console doctrine:migrations:migrate

# Démarrer le serveur Symfony
symfony server:start
# ou
php -S 127.0.0.1:8000 -t public
```

Le backend sera accessible à l'adresse : `http://localhost:8000`

### 4. Créer un utilisateur admin

```bash
# Générer un hash de mot de passe
php bin/console security:hash-password

# Se connecter à MySQL et insérer l'utilisateur
mysql -u root -p portfolio_db

INSERT INTO user (email, roles, password) 
VALUES ('admin@example.com', '["ROLE_ADMIN"]', 'VOTRE_HASH_ICI');
```

## Utilisation

### Accès public
- Visitez `http://localhost:3000` pour accéder au portfolio
- Naviguez entre les sections : Accueil, Projets, Parcours, Compétences, Contact
- Cliquez sur un projet pour voir les détails et les images
- Utilisez le formulaire de contact pour envoyer un message

### Accès admin
- Accédez à `http://localhost:3000/login`
- Connectez-vous avec vos identifiants admin
- Gérez les messages, projets, timeline, compétences et icônes tech depuis le panneau d'administration

## Structure du projet

```
mon-portfolio-retro/
├── public/              # Fichiers statiques
├── src/                 # Code source React
│   ├── components/      # Composants React
│   ├── pages/           # Pages principales
│   └── App.js           # Composant principal
├── backend/             # Backend Symfony
│   ├── src/
│   │   ├── Controller/  # Contrôleurs API
│   │   ├── Entity/      # Entités Doctrine
│   │   └── Repository/  # Repositories
│   ├── config/          # Configuration Symfony
│   └── public/          # Point d'entrée backend
└── README.md            # Ce fichier
```

## Technologies utilisées

### Frontend
- React 18
- React Router
- React Icons
- CSS3 avec animations
- Fetch API

### Backend
- Symfony 6
- Doctrine ORM
- MySQL
- Nelmio CORS Bundle

## Personnalisation

### Modifier les informations personnelles
Éditez les fichiers suivants :
- `src/components/Presentation.js` - Informations de la page d'accueil
- `src/components/Navbar.js` - Liens de navigation

### Ajouter du contenu
Utilisez le panneau d'administration pour :
- Ajouter/modifier/supprimer des projets
- Gérer la timeline
- Mettre à jour les compétences
- Gérer les icônes technologiques

### Modifier le style
Les styles sont organisés par composant :
- Chaque composant a son propre fichier CSS
- `src/App.css` contient les styles globaux et l'écran de chargement

## Déploiement

Consultez le fichier `TECHNICAL.md` pour des instructions détaillées sur le déploiement en production.

## Support

Pour toute question ou problème, contactez-moi via le formulaire de contact du portfolio.

## Licence

Ce projet est personnel et à usage non commercial.

## Auteur

Louis Le Gouge
