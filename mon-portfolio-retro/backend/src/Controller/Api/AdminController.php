<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use App\Repository\ContactRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(Request $request, UserRepository $userRepository): JsonResponse
    {
        $session = $request->getSession();
        $userId = $session->get('user_id');
        if (!$userId) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $user = $userRepository->find($userId);
        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/api/messages', name: 'api_messages', methods: ['GET'])]
    public function messages(Request $request, ContactRepository $contactRepository): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $contacts = $contactRepository->findBy([], ['id' => 'DESC']);
        $data = array_map(function ($c) {
            return [
                'id' => $c->getId(),
                'name' => $c->getName(),
                'email' => $c->getEmail(),
                'phone' => $c->getPhone(),
                'message' => $c->getMessage(),
            ];
        }, $contacts);

        return $this->json($data);
    }

    #[Route('/api/messages/{id}', name: 'api_message_delete', methods: ['DELETE'])]
    public function deleteMessage(int $id, Request $request, ContactRepository $contactRepository, EntityManagerInterface $em): JsonResponse
    {
        $session = $request->getSession();
        if (!$session->get('user_id')) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        $contact = $contactRepository->find($id);
        if (!$contact) {
            return new JsonResponse(['error' => 'Message introuvable'], 404);
        }

        $em->remove($contact);
        $em->flush();
        return new JsonResponse(['message' => 'Message supprimé']);
    }
} 