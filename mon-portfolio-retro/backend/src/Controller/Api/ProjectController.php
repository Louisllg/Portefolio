<?php

namespace App\Controller\Api;

use App\Entity\Project;
use App\Entity\ProjectImage;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ProjectController extends AbstractController
{
    // Public: Get all projects
    #[Route('/api/projects', methods: ['GET'])]
    public function getAll(ProjectRepository $repo): JsonResponse
    {
        $projects = $repo->findBy([], ['id' => 'ASC']);
        $data = [];
        
        foreach ($projects as $p) {
            $images = [];
            foreach ($p->getImages() as $img) {
                $images[] = $img->getImageUrl();
            }
            
            $data[] = [
                'id' => $p->getId(),
                'title' => $p->getTitle(),
                'description' => $p->getDescription(),
                'functionalities' => $p->getFunctionalities(),
                'githubLink' => $p->getGithubLink(),
                'images' => $images
            ];
        }
        
        return new JsonResponse($data);
    }

    // Admin: Create project
    #[Route('/api/admin/projects', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Check if user is authenticated
        $session = $request->getSession();
        if (!$session->has('user_id')) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!$data || !isset($data['title'], $data['description'], $data['functionalities'])) {
            return new JsonResponse(['error' => 'Missing required fields'], 400);
        }

        $project = new Project();
        $project->setTitle($data['title'])
                ->setDescription($data['description'])
                ->setFunctionalities($data['functionalities'])
                ->setGithubLink($data['githubLink'] ?? null);

        // Handle images
        if (isset($data['images']) && is_array($data['images'])) {
            foreach ($data['images'] as $imageUrl) {
                if (!empty($imageUrl)) {
                    $projectImage = new ProjectImage();
                    $projectImage->setImageUrl($imageUrl);
                    $project->addImage($projectImage);
                }
            }
        }

        $em->persist($project);
        $em->flush();

        return new JsonResponse([
            'message' => 'Project created',
            'id' => $project->getId()
        ], 201);
    }

    // Admin: Update project
    #[Route('/api/admin/projects/{id}', methods: ['PUT'])]
    public function update(int $id, Request $request, ProjectRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        // Check if user is authenticated
        $session = $request->getSession();
        if (!$session->has('user_id')) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $project = $repo->find($id);
        if (!$project) {
            return new JsonResponse(['error' => 'Project not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $project->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $project->setDescription($data['description']);
        }
        if (isset($data['functionalities'])) {
            $project->setFunctionalities($data['functionalities']);
        }
        if (isset($data['githubLink'])) {
            $project->setGithubLink($data['githubLink']);
        }

        // Handle images update
        if (isset($data['images']) && is_array($data['images'])) {
            // Remove old images
            foreach ($project->getImages() as $img) {
                $project->removeImage($img);
                $em->remove($img);
            }

            // Add new images
            foreach ($data['images'] as $imageUrl) {
                if (!empty($imageUrl)) {
                    $projectImage = new ProjectImage();
                    $projectImage->setImageUrl($imageUrl);
                    $project->addImage($projectImage);
                }
            }
        }

        $em->flush();

        return new JsonResponse(['message' => 'Project updated']);
    }

    // Admin: Delete project
    #[Route('/api/admin/projects/{id}', methods: ['DELETE'])]
    public function delete(int $id, Request $request, ProjectRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        // Check if user is authenticated
        $session = $request->getSession();
        if (!$session->has('user_id')) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        $project = $repo->find($id);
        if (!$project) {
            return new JsonResponse(['error' => 'Project not found'], 404);
        }

        $em->remove($project);
        $em->flush();

        return new JsonResponse(['message' => 'Project deleted']);
    }
}

