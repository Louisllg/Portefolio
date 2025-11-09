<?php

namespace App\Controller\Api;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class AuthController extends AbstractController
{
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!$data || !isset($data['email'], $data['password'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $user = $userRepository->findOneBy(['email' => $data['email']]);
        if (!$user) {
            // Avoid user enumeration timing
            usleep(50000);
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }

        $hash = $user->getPassword(); // mapped to password_hash
        $isValid = is_string($hash) && password_verify($data['password'], $hash);
        if (!$isValid) {
            return new JsonResponse(['error' => 'Identifiants invalides'], 401);
        }

        // Start session-based login
        $session = $request->getSession();
        $session->set('user_id', $user->getId());
        $session->set('user_email', $user->getEmail());
        $session->set('roles', $user->getRoles());

        return new JsonResponse(['message' => 'Connexion réussie']);
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        $session = $request->getSession();
        $session->invalidate();
        return new JsonResponse(['message' => 'Déconnecté']);
    }
} 