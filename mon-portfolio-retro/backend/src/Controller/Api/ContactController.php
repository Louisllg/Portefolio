<?php

namespace App\Controller\Api;

use App\Entity\Contact;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ContactController extends AbstractController
{
    #[Route('/api/contact', methods:['POST'])]
    public function addContact(Request $request, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['name'], $data['email'], $data['message'])) {
            return new JsonResponse(['error' => 'Données invalides'], 400);
        }

        $contact = new Contact();
        $contact->setName($data['name'])
                ->setEmail($data['email'])
                ->setPhone($data['phone'] ?? null)
                ->setMessage($data['message']);

        $em->persist($contact);
        $em->flush();

        return new JsonResponse(['message' => 'Message enregistré'], 201);
    }
}