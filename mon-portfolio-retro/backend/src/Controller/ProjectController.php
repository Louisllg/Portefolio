<?php

namespace App\Controller;

use App\Repository\ProjectRepository;
use App\Repository\ProjectImageRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ProjectController extends AbstractController
{
    #[Route('/api/projects', name: 'api_projects', methods: ['GET'])]
    public function getProjects(ProjectRepository $projectRepository, ProjectImageRepository $projectImageRepository): JsonResponse
    {
        $projects = $projectRepository->findAll();

        $data = [];
        foreach ($projects as $project) {
            $images = $projectImageRepository->findBy(['project' => $project]);
            $imageUrls = array_map(fn($img) => $img->getImageUrl(), $images);

            $data[] = [
                'id' => $project->getId(),
                'title' => $project->getTitle(),
                'description' => $project->getDescription(),
                'functionalities' => $project->getFunctionalities(),
                'images' => $imageUrls
            ];
        }

        return $this->json($data);
    }
}
