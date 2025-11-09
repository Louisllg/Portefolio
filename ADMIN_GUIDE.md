# 🎯 Guide de Gestion Admin Portfolio

## ✅ Ce qui a été fait

### 1. Base de données (SQL créé)
- **timeline_event** : Gestion des événements du parcours
- **skill** : Gestion des compétences (barres de progression)
- **tech_icon** : Gestion des icônes techno (React, Symfony, etc.)

### 2. Backend Symfony
✅ **Entités créées** :
- `TimelineEvent.php`
- `Skill.php`
- `TechIcon.php`

✅ **Repositories créés** :
- `TimelineEventRepository.php`
- `SkillRepository.php`
- `TechIconRepository.php`

✅ **API Controllers créés** :
- `TimelineController.php` (GET public + CRUD admin)
- `SkillController.php` (GET public + CRUD admin pour skills et techIcons)

### 3. Frontend React
✅ **Admin.js** : Panel admin avec onglets pour gérer :
- 📧 Messages (contact form)
- 📂 Projets (visualisation, CRUD à venir)
- 📅 Timeline (visualisation + suppression)
- 💪 Compétences (visualisation + suppression)
- 🎨 Icônes Techno (visualisation + suppression)

✅ **Timeline.js** : Fetch dynamique depuis `/api/timeline`

✅ **Skills.js** : Fetch dynamique depuis `/api/skills`

---

## 🔗 Routes API disponibles

### Public (pas de connexion requise)
```
GET /api/timeline         → Liste des événements timeline
GET /api/skills           → Liste des compétences + icônes techno
GET /api/projects         → Liste des projets
```

### Admin (connexion requise)
```
POST   /api/admin/timeline        → Créer événement timeline
PUT    /api/admin/timeline/{id}   → Modifier événement timeline
DELETE /api/admin/timeline/{id}   → Supprimer événement timeline

POST   /api/admin/skills          → Créer compétence
PUT    /api/admin/skills/{id}     → Modifier compétence
DELETE /api/admin/skills/{id}     → Supprimer compétence

POST   /api/admin/tech-icons      → Créer icône techno
PUT    /api/admin/tech-icons/{id} → Modifier icône techno
DELETE /api/admin/tech-icons/{id} → Supprimer icône techno
```

---

## 🧪 Comment tester

### 1. Vérifier que les données SQL sont insérées
```sql
SELECT * FROM timeline_event;
SELECT * FROM skill;
SELECT * FROM tech_icon;
```

### 2. Tester l'API publique
```bash
# Timeline
curl http://localhost:8000/api/timeline

# Skills + TechIcons
curl http://localhost:8000/api/skills
```

### 3. Tester l'Admin Frontend
1. Lance le backend Symfony : `cd backend && symfony server:start`
2. Lance le frontend React : `npm start`
3. Va sur `/login` et connecte-toi
4. Une fois dans l'admin, clique sur les onglets :
   - **Messages** : voir les messages du formulaire contact
   - **Timeline** : voir les événements (suppression active)
   - **Compétences** : voir les skills (suppression active)
   - **Icônes Techno** : voir les icônes (suppression active)

---

## 📋 Prochaines étapes (à faire si besoin)

### Pour Timeline, Skills, TechIcons
- [ ] Ajouter formulaires de création/édition dans l'Admin
- [ ] Ajouter drag & drop pour réorganiser les positions
- [ ] Ajouter upload d'images pour timeline (si besoin)

### Pour Projects
- [ ] Créer API CRUD complète (création, édition, suppression)
- [ ] Gérer upload d'images projet
- [ ] Intégrer formulaire admin pour ajouter/modifier projets

---

## 🎨 Icônes React Icons disponibles
Pour ajouter des icônes techno, utilise ces noms dans `icon_name` :
- `FaReact` → React
- `FaSymfony` → Symfony
- `FaPhp` → PHP
- `FaNodeJs` → Node.js
- `FaJsSquare` → JavaScript
- `FaHtml5` → HTML5
- `FaCss3Alt` → CSS3

Si tu veux ajouter d'autres icônes, il faudra :
1. Les installer : `npm install react-icons`
2. Les importer dans `Skills.js`
3. Les ajouter au `iconMap`

---

## 🚀 Résumé des fonctionnalités actuelles

| Fonctionnalité         | État         | Actions disponibles                |
|------------------------|--------------|-------------------------------------|
| **Messages Contact**   | ✅ Complet   | Liste, Recherche, Copie, Suppression |
| **Timeline**           | ✅ API OK    | Liste, Suppression (Création/Édition à ajouter) |
| **Compétences**        | ✅ API OK    | Liste, Suppression (Création/Édition à ajouter) |
| **Icônes Techno**      | ✅ API OK    | Liste, Suppression (Création/Édition à ajouter) |
| **Projets**            | 🔄 Partiel   | Liste uniquement (CRUD à compléter) |

---

## 💡 Note importante
Les données Timeline, Skills et TechIcons sont maintenant **dynamiques** : elles proviennent de la BDD. Si tu modifies les données en BDD (via phpMyAdmin ou l'API), les changements seront visibles immédiatement sur le site public.

---

**Créé le 7 nov 2025 - Portfolio Louis Le Gouge**

