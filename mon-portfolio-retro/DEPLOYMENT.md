# Guide de Déploiement Rapide

## Prérequis
- Compte GitHub (✅ fait)
- Compte Railway (à créer)
- Compte Vercel (à créer)

## Étape 1 : Push sur GitHub

```bash
cd mon-portfolio-retro
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Étape 2 : Backend sur Railway

1. **Créer un compte sur Railway**
   - Va sur https://railway.app
   - Clique "Start a New Project"
   - Connecte-toi avec GitHub

2. **Déployer le backend**
   - Clique "Deploy from GitHub repo"
   - Sélectionne ton repo
   - Sélectionne le dossier `backend/`

3. **Ajouter MySQL**
   - Clique "+ New" → "Database" → "MySQL"
   - Railway crée automatiquement la base

4. **Variables d'environnement**
   Dans Settings → Variables, ajoute :
   ```
   APP_ENV=prod
   APP_SECRET=ton_secret_genere
   DATABASE_URL=${MYSQL_URL}
   FRONTEND_URL=https://ton-portfolio.vercel.app
   ```
   
   Pour générer APP_SECRET :
   ```bash
   openssl rand -base64 32
   ```

5. **Exécuter les migrations**
   - Deploy → "..." → "Run Command"
   - Commande : `php bin/console doctrine:migrations:migrate --no-interaction`

6. **Noter l'URL**
   - Copie l'URL Railway (ex: https://backend-production-xyz.up.railway.app)

## Étape 3 : Frontend sur Vercel

1. **Créer un compte sur Vercel**
   - Va sur https://vercel.com
   - Connecte-toi avec GitHub

2. **Importer le projet**
   - "Add New..." → "Project"
   - Sélectionne ton repo

3. **Configuration**
   - Root Directory : `mon-portfolio-retro`
   - Framework Preset : Create React App (auto-détecté)
   - Environment Variables :
     ```
     REACT_APP_API_URL=https://ton-backend.railway.app
     ```

4. **Déployer**
   - Clique "Deploy"
   - Attends 2-3 minutes

5. **URL finale**
   - Copie l'URL Vercel (ex: https://mon-portfolio.vercel.app)

## Étape 4 : Retour sur Railway

1. **Mettre à jour FRONTEND_URL**
   - Retourne sur Railway
   - Settings → Variables
   - Modifie `FRONTEND_URL` avec l'URL Vercel

2. **Créer l'utilisateur admin**
   - Deploy → "..." → "Run Command"
   - Génère un hash :
     ```
     php bin/console security:hash-password
     ```
   - Copie le hash généré
   
   - Accède à la base MySQL :
     - Railway → MySQL → Connect
     - Ou utilise un outil comme phpMyAdmin
   
   - Insère l'utilisateur :
     ```sql
     INSERT INTO user (email, roles, password) 
     VALUES ('admin@example.com', '["ROLE_ADMIN"]', 'TON_HASH_ICI');
     ```

## Étape 5 : Tester

1. **Frontend** : Visite ton URL Vercel
2. **Login** : Va sur /login et connecte-toi
3. **Admin** : Ajoute du contenu via /admin

## Troubleshooting

### CORS Error
- Vérifie que `FRONTEND_URL` est bien configurée sur Railway
- Redéploie le backend si nécessaire

### 500 Error Backend
- Vérifie les logs Railway
- Assure-toi que les migrations sont exécutées

### Frontend ne charge pas
- Vérifie `REACT_APP_API_URL` dans Vercel
- Redéploie si nécessaire

## URLs Importantes

- **Frontend** : https://[ton-nom].vercel.app
- **Backend** : https://[ton-nom].railway.app
- **Admin** : https://[ton-nom].vercel.app/login

## Support

En cas de problème, vérifie :
1. Les logs Railway (Deploy → Logs)
2. Les variables d'environnement
3. Que les migrations sont bien exécutées

