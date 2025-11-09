<?php

namespace App\Controller\Api;

use App\Entity\Skill;
use App\Entity\TechIcon;
use App\Repository\SkillRepository;
use App\Repository\TechIconRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class SkillController extends AbstractController
{
    #[Route('/api/skills', name: 'api_skills_list', methods: ['GET'])]
    public function list(SkillRepository $skillRepo, TechIconRepository $iconRepo): JsonResponse
    {
        $skills = $skillRepo->findBy([], ['position' => 'ASC']);
        $icons = $iconRepo->findBy([], ['position' => 'ASC']);

        $skillsData = array_map(function($skill) {
            return [
                'id' => $skill->getId(),
                'name' => $skill->getName(),
                'level' => $skill->getLevel(),
                'position' => $skill->getPosition()
            ];
        }, $skills);

        $iconsData = array_map(function($icon) {
            return [
                'id' => $icon->getId(),
                'name' => $icon->getName(),
                'iconName' => $icon->getIconName(),
                'position' => $icon->getPosition()
            ];
        }, $icons);

        return $this->json([
            'skills' => $skillsData,
            'techIcons' => $iconsData
        ]);
    }

    // === CRUD Skills ===
    #[Route('/api/admin/skills', name: 'api_skill_create', methods: ['POST'])]
    public function createSkill(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['level'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $skill = new Skill();
        $skill->setName($data['name'])
              ->setLevel($data['level'])
              ->setPosition($data['position'] ?? 0);

        $em->persist($skill);
        $em->flush();

        return new JsonResponse(['message' => 'Compétence créée', 'id' => $skill->getId()], 201);
    }

    #[Route('/api/admin/skills/{id}', name: 'api_skill_update', methods: ['PUT'])]
    public function updateSkill(int $id, Request $request, SkillRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $skill = $repo->find($id);
        if (!$skill) {
            return new JsonResponse(['error' => 'Compétence introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        if (isset($data['name'])) $skill->setName($data['name']);
        if (isset($data['level'])) $skill->setLevel($data['level']);
        if (isset($data['position'])) $skill->setPosition($data['position']);

        $em->flush();

        return new JsonResponse(['message' => 'Compétence mise à jour']);
    }

    #[Route('/api/admin/skills/{id}', name: 'api_skill_delete', methods: ['DELETE'])]
    public function deleteSkill(int $id, Request $request, SkillRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $skill = $repo->find($id);
        if (!$skill) {
            return new JsonResponse(['error' => 'Compétence introuvable'], 404);
        }

        $em->remove($skill);
        $em->flush();

        return new JsonResponse(['message' => 'Compétence supprimée']);
    }

    // === CRUD Tech Icons ===
    #[Route('/api/admin/tech-icons', name: 'api_techicon_create', methods: ['POST'])]
    public function createTechIcon(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['name'], $data['iconName'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $icon = new TechIcon();
        $icon->setName($data['name'])
             ->setIconName($data['iconName'])
             ->setPosition($data['position'] ?? 0);

        $em->persist($icon);
        $em->flush();

        return new JsonResponse(['message' => 'Icône créée', 'id' => $icon->getId()], 201);
    }

    #[Route('/api/admin/tech-icons/{id}', name: 'api_techicon_update', methods: ['PUT'])]
    public function updateTechIcon(int $id, Request $request, TechIconRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $icon = $repo->find($id);
        if (!$icon) {
            return new JsonResponse(['error' => 'Icône introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        if (isset($data['name'])) $icon->setName($data['name']);
        if (isset($data['iconName'])) $icon->setIconName($data['iconName']);
        if (isset($data['position'])) $icon->setPosition($data['position']);

        $em->flush();

        return new JsonResponse(['message' => 'Icône mise à jour']);
    }

    #[Route('/api/admin/tech-icons/{id}', name: 'api_techicon_delete', methods: ['DELETE'])]
    public function deleteTechIcon(int $id, Request $request, TechIconRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $icon = $repo->find($id);
        if (!$icon) {
            return new JsonResponse(['error' => 'Icône introuvable'], 404);
        }

        $em->remove($icon);
        $em->flush();

        return new JsonResponse(['message' => 'Icône supprimée']);
    }
}

