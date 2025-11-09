# Documentation Technique - Portfolio Retro

## Architecture du projet

### Vue d'ensemble

Le projet est divisé en deux parties principales :
- **Frontend** : Application React (Single Page Application)
- **Backend** : API REST Symfony avec base de données MySQL

### Communication Frontend-Backend

- Le frontend communique avec le backend via l'API REST
- Endpoint API : `http://localhost:8000/api/`
- Authentification : Sessions Symfony avec cookies
- CORS : Configuré pour autoriser `localhost:3000`

## Frontend (React)

### Structure des composants

```
src/
├── components/
│   ├── Navbar.js/css           # Barre de navigation fixe
│   ├── Presentation.js/css     # Section héro
│   ├── Projects.js/css         # Grille de projets avec modal
│   ├── Timeline.js/css         # Parcours professionnel
│   ├── Skills.js/css           # Compétences avec barres de progression
│   ├── Contact.js/css          # Formulaire de contact
│   ├── Admin.js/css            # Panneau d'administration
│   └── Login.js/css            # Page de connexion
├── pages/
│   └── Home.js                 # Page principale
├── App.js                      # Point d'entrée, gestion du loading
└── App.css                     # Styles globaux et loading screen
```

### Fonctionnalités clés

#### Écran de chargement
- Simule un boot de terminal
- Barre de progression dynamique (minimum 1.8s, maximum 3s)
- Adapte la vitesse en fonction de la performance du système
- Animations CSS avec keyframes

#### Gestion d'état
- Utilisation de `useState` et `useEffect` pour la gestion d'état locale
- Pas de Redux : le projet est suffisamment petit
- Données chargées au montage des composants

#### Navigation
- React Router v6
- Routes :
  - `/` : Page d'accueil
  - `/login` : Page de connexion
  - `/admin` : Panneau admin (protégé)

#### Responsive Design
- Mobile-first approach
- Breakpoints :
  - 480px : Mobile
  - 768px : Tablette
  - 1024px : Desktop
- Menu burger sur mobile

### API Frontend

Toutes les requêtes API utilisent `fetch` avec `credentials: 'include'` pour les cookies de session.

#### Endpoints utilisés

**Public**
- `GET /api/projects` : Liste des projets
- `GET /api/timeline-events` : Événements timeline
- `GET /api/skills` : Compétences
- `GET /api/tech-icons` : Icônes technologiques
- `POST /api/contact` : Envoi du formulaire de contact

**Authentification**
- `POST /api/login` : Connexion
- `GET /api/me` : Vérification de session
- `POST /api/logout` : Déconnexion

**Admin (ROLE_ADMIN requis)**
- `POST /api/admin/projects` : Créer un projet
- `PUT /api/admin/projects/{id}` : Modifier un projet
- `DELETE /api/admin/projects/{id}` : Supprimer un projet
- `POST /api/admin/timeline-events` : Créer un événement
- `PUT /api/admin/timeline-events/{id}` : Modifier un événement
- `DELETE /api/admin/timeline-events/{id}` : Supprimer un événement
- (Idem pour skills et tech-icons)
- `DELETE /api/messages/{id}` : Supprimer un message

## Backend (Symfony)

### Structure

```
backend/
├── config/
│   ├── packages/
│   │   ├── doctrine.yaml       # Configuration BDD
│   │   ├── nelmio_cors.yaml    # Configuration CORS
│   │   └── security.yaml       # Authentification
│   └── routes.yaml
├── src/
│   ├── Controller/
│   │   └── Api/                # Contrôleurs API
│   │       ├── ContactController.php
│   │       ├── ProjectController.php
│   │       ├── TimelineEventController.php
│   │       ├── SkillController.php
│   │       ├── TechIconController.php
│   │       ├── SecurityController.php
│   │       └── UserController.php
│   ├── Entity/                 # Entités Doctrine
│   │   ├── User.php
│   │   ├── Contact.php
│   │   ├── Project.php
│   │   ├── ProjectImage.php
│   │   ├── TimelineEvent.php
│   │   ├── Skill.php
│   │   └── TechIcon.php
│   └── Repository/             # Repositories Doctrine
└── migrations/                 # Migrations BDD
```

### Base de données

#### Schéma

**user**
- id (INT, PK, AUTO_INCREMENT)
- email (VARCHAR 180, UNIQUE)
- roles (JSON)
- password (VARCHAR 255, hash bcrypt)

**contact**
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 255)
- email (VARCHAR 255)
- phone (VARCHAR 20, nullable)
- message (TEXT)
- created_at (DATETIME)

**project**
- id (INT, PK, AUTO_INCREMENT)
- title (VARCHAR 255)
- description (TEXT)
- functionalities (TEXT)
- github_link (VARCHAR 500, nullable)

**project_image**
- id (INT, PK, AUTO_INCREMENT)
- project_id (INT, FK)
- image_url (VARCHAR 500)

**timeline_event**
- id (INT, PK, AUTO_INCREMENT)
- date (VARCHAR 50)
- title (VARCHAR 255)
- description (TEXT)

**skill**
- id (INT, PK, AUTO_INCREMENT)
- name (VARCHAR 255)
- percentage (INT)

**tech_icon**
- id (INT, PK, AUTO_INCREMENT)
- icon_name (VARCHAR 100)
- display_name (VARCHAR 100)

### Sécurité

#### Authentification
- Système de sessions Symfony natif
- Mot de passe hashé avec bcrypt
- Cookie de session avec SameSite=Lax

#### Protection des routes
- Routes admin protégées par `#[IsGranted('ROLE_ADMIN')]`
- Vérification automatique par le Security Component
- Retour 401 si non authentifié
- Retour 403 si authentifié mais sans le rôle

#### CORS
- Origines autorisées : `http://localhost:3000`, `http://127.0.0.1:3000`
- Méthodes : GET, POST, PUT, DELETE, OPTIONS
- Headers : Content-Type, Authorization
- Credentials : true (pour les cookies)

### Gestion des images de projets

Les images sont stockées sous forme d'URLs externes :
- Utiliser des services comme Imgur, Cloudinary, etc.
- Format attendu : URL complète (ex: `https://i.imgur.com/exemple.png`)
- Cascade sur suppression de projet : les ProjectImage associées sont automatiquement supprimées

## Déploiement

### Option 1 : Vercel (Frontend) + Railway (Backend)

#### Frontend sur Vercel
1. Créer un compte sur [Vercel](https://vercel.com)
2. Connecter le repository GitHub
3. Configurer les variables d'environnement :
   - `REACT_APP_API_URL=https://votre-backend.railway.app`
4. Build automatique à chaque push

#### Backend sur Railway
1. Créer un compte sur [Railway](https://railway.app)
2. Créer un nouveau projet
3. Ajouter un service MySQL
4. Déployer le backend depuis GitHub
5. Configurer les variables d'environnement :
   - `DATABASE_URL` (fourni par Railway)
   - `APP_ENV=prod`
   - `APP_SECRET` (générer avec `openssl rand -base64 32`)
6. Exécuter les migrations :
   ```bash
   php bin/console doctrine:migrations:migrate --no-interaction
   ```

### Option 2 : VPS traditionnel (OVH, Scaleway, etc.)

#### Prérequis serveur
- Ubuntu 22.04 LTS
- Nginx
- PHP 8.1-FPM
- MySQL 8.0
- Node.js 18 LTS
- Certbot (pour SSL)

#### Étapes de déploiement

1. **Installation des dépendances**
```bash
sudo apt update
sudo apt install nginx php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring composer mysql-server nodejs npm
```

2. **Configuration MySQL**
```bash
sudo mysql_secure_installation
mysql -u root -p
CREATE DATABASE portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'portfolio_user'@'localhost' IDENTIFIED BY 'mot_de_passe_fort';
GRANT ALL PRIVILEGES ON portfolio_db.* TO 'portfolio_user'@'localhost';
FLUSH PRIVILEGES;
```

3. **Déploiement Backend**
```bash
cd /var/www/
git clone <repo-url> portfolio
cd portfolio/backend
composer install --no-dev --optimize-autoloader
php bin/console doctrine:migrations:migrate --no-interaction
```

4. **Build Frontend**
```bash
cd /var/www/portfolio
npm install
npm run build
```

5. **Configuration Nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /var/www/portfolio/build;
    
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

server {
    listen 8000;
    server_name localhost;
    root /var/www/portfolio/backend/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    location ~ ^/index\.php(/|$) {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        internal;
    }
}
```

6. **SSL avec Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.com
```

### Variables d'environnement en production

**Backend (.env.local)**
```env
APP_ENV=prod
APP_SECRET=votre_secret_genere
DATABASE_URL="mysql://user:pass@127.0.0.1:3306/portfolio_db"
```

**Frontend (.env.production)**
```env
REACT_APP_API_URL=https://votre-domaine.com
```

## Maintenance

### Mise à jour du contenu
Utiliser le panneau d'administration pour :
- Ajouter/modifier/supprimer des projets
- Gérer la timeline
- Mettre à jour les compétences
- Gérer les icônes tech

### Sauvegardes
Sauvegarder régulièrement la base de données :
```bash
mysqldump -u user -p portfolio_db > backup_$(date +%Y%m%d).sql
```

### Logs
- Backend : `backend/var/log/prod.log`
- Nginx : `/var/log/nginx/error.log` et `/var/log/nginx/access.log`

## Performance

### Frontend
- Build de production minifié et optimisé
- Lazy loading des composants (si besoin)
- Images optimisées et hébergées sur CDN

### Backend
- OPcache activé en production
- Doctrine cache activé
- API responses cachées si nécessaire

## Tests

### Frontend
```bash
npm test
```

### Backend
```bash
php bin/phpunit
```

## Troubleshooting

### CORS errors
Vérifier :
- `nelmio_cors.yaml` contient la bonne origine
- Le frontend envoie bien `credentials: 'include'`
- Les cookies sont autorisés dans le navigateur

### Session non persistante
Vérifier :
- Configuration session dans `security.yaml`
- Les cookies sont autorisés
- Le domaine du cookie correspond

### 401/403 sur routes admin
Vérifier :
- L'utilisateur est bien connecté (`/api/me`)
- L'utilisateur a le rôle `ROLE_ADMIN`
- Les routes sont bien protégées par `#[IsGranted('ROLE_ADMIN')]`

## Contributions

Ce projet est personnel. Pour toute suggestion, merci de me contacter via le formulaire du portfolio.

