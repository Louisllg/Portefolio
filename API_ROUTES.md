# 📡 Routes API Portfolio - Documentation Complète

## 🔓 Routes Publiques (pas de connexion requise)

### Timeline
```
GET /api/timeline
```
**Retourne** : Liste des événements timeline triés par position

**Exemple réponse** :
```json
[
  {
    "id": 1,
    "date": "2024",
    "title": "Développeur Fullstack",
    "desc": "React.js & Symfony",
    "position": 1
  }
]
```

---

### Skills + TechIcons
```
GET /api/skills
```
**Retourne** : Liste des compétences + icônes techno

**Exemple réponse** :
```json
{
  "skills": [
    {
      "id": 1,
      "name": "Frontend",
      "level": 90,
      "position": 1
    }
  ],
  "techIcons": [
    {
      "id": 1,
      "name": "React",
      "iconName": "FaReact",
      "position": 1
    }
  ]
}
```

---

### Projects
```
GET /api/projects
```
**Retourne** : Liste des projets

---

### Contact (formulaire public)
```
POST /api/contact
```
**Body** :
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "0612345678",
  "message": "Bonjour..."
}
```

---

## 🔒 Routes Admin (connexion requise)

### Authentification

#### Login
```
POST /api/login
```
**Body** :
```json
{
  "email": "admin@example.com",
  "password": "monmdp"
}
```

#### Logout
```
POST /api/logout
```

#### Vérifier session
```
GET /api/me
```
**Retourne** : Infos de l'utilisateur connecté

---

### Timeline CRUD

#### Créer événement
```
POST /api/admin/timeline
```
**Body** :
```json
{
  "date": "2025",
  "title": "Nouveau poste",
  "description": "Description du poste",
  "position": 1
}
```

#### Modifier événement
```
PUT /api/admin/timeline/{id}
```
**Body** : Même structure que création (tous les champs optionnels)

#### Supprimer événement
```
DELETE /api/admin/timeline/{id}
```

---

### Skills CRUD

#### Créer compétence
```
POST /api/admin/skills
```
**Body** :
```json
{
  "name": "React.js",
  "level": 85,
  "position": 1
}
```

#### Modifier compétence
```
PUT /api/admin/skills/{id}
```
**Body** : Même structure que création (tous les champs optionnels)

#### Supprimer compétence
```
DELETE /api/admin/skills/{id}
```

---

### TechIcons CRUD

#### Créer icône
```
POST /api/admin/tech-icons
```
**Body** :
```json
{
  "name": "React",
  "iconName": "FaReact",
  "position": 1
}
```

#### Modifier icône
```
PUT /api/admin/tech-icons/{id}
```
**Body** : Même structure que création (tous les champs optionnels)

#### Supprimer icône
```
DELETE /api/admin/tech-icons/{id}
```

---

### Messages CRUD

#### Lister messages
```
GET /api/messages
```

#### Supprimer message
```
DELETE /api/messages/{id}
```

---

## 🧪 Tester avec cURL

### Timeline - Créer
```bash
curl -X POST http://localhost:8000/api/admin/timeline \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "date": "2025",
    "title": "Test",
    "description": "Description test",
    "position": 99
  }'
```

### Skills - Créer
```bash
curl -X POST http://localhost:8000/api/admin/skills \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Skill",
    "level": 75,
    "position": 99
  }'
```

### TechIcons - Créer
```bash
curl -X POST http://localhost:8000/api/admin/tech-icons \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Python",
    "iconName": "FaPhp",
    "position": 99
  }'
```

---

## 🎨 Icônes disponibles

Liste des `iconName` valides pour TechIcons :
- `FaReact` → React
- `FaSymfony` → Symfony
- `FaPhp` → PHP
- `FaNodeJs` → Node.js
- `FaJsSquare` → JavaScript
- `FaHtml5` → HTML5
- `FaCss3Alt` → CSS3

Pour ajouter d'autres icônes, modifie le `iconMap` dans `Skills.js`.

---

## 🔐 Notes de sécurité

- Toutes les routes `/api/admin/*` nécessitent une session active
- Les routes publiques ne modifient pas les données (sauf `/api/contact`)
- Les sessions sont gérées par Symfony avec cookies sécurisés
- CORS configuré pour `http://localhost:3000`

---

**Dernière mise à jour : 7 nov 2025**

