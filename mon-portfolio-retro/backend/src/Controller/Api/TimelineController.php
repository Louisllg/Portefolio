<?php

namespace App\Controller\Api;

use App\Entity\TimelineEvent;
use App\Repository\TimelineEventRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class TimelineController extends AbstractController
{
    #[Route('/api/timeline', name: 'api_timeline_list', methods: ['GET'])]
    public function list(TimelineEventRepository $repo): JsonResponse
    {
        $events = $repo->findBy([], ['position' => 'ASC']);
        $data = array_map(function($event) {
            return [
                'id' => $event->getId(),
                'date' => $event->getDate(),
                'title' => $event->getTitle(),
                'desc' => $event->getDescription(),
                'position' => $event->getPosition()
            ];
        }, $events);

        return $this->json($data);
    }

    #[Route('/api/admin/timeline', name: 'api_timeline_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['date'], $data['title'], $data['description'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $event = new TimelineEvent();
        $event->setDate($data['date'])
              ->setTitle($data['title'])
              ->setDescription($data['description'])
              ->setPosition($data['position'] ?? 0);

        $em->persist($event);
        $em->flush();

        return new JsonResponse([
            'message' => 'Événement créé',
            'id' => $event->getId()
        ], 201);
    }

    #[Route('/api/admin/timeline/{id}', name: 'api_timeline_update', methods: ['PUT'])]
    public function update(int $id, Request $request, TimelineEventRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $event = $repo->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Événement introuvable'], 404);
        }

        $data = json_decode($request->getContent(), true);
        if (!$data) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        if (isset($data['date'])) $event->setDate($data['date']);
        if (isset($data['title'])) $event->setTitle($data['title']);
        if (isset($data['description'])) $event->setDescription($data['description']);
        if (isset($data['position'])) $event->setPosition($data['position']);

        $em->flush();

        return new JsonResponse(['message' => 'Événement mis à jour']);
    }

    #[Route('/api/admin/timeline/{id}', name: 'api_timeline_delete', methods: ['DELETE'])]
    public function delete(int $id, Request $request, TimelineEventRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $event = $repo->find($id);
        if (!$event) {
            return new JsonResponse(['error' => 'Événement introuvable'], 404);
        }

        $em->remove($event);
        $em->flush();

        return new JsonResponse(['message' => 'Événement supprimé']);
    }
}

