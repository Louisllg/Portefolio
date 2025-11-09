<?php

namespace App\Tests\Controller;

use App\Entity\Project;
use App\Entity\ProjectImage;
use App\Repository\ProjectRepository;
use App\Repository\ProjectImageRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProjectControllerTest extends WebTestCase
{
    public function testGetProjectsReturnsList(): void
    {
        $client = static::createClient();
        $container = static::getContainer();

        $p = (new Project())->setTitle('T1')->setDescription('D')->setFunctionalities('F');
        $rp = new \ReflectionClass($p); $prop = $rp->getProperty('id'); $prop->setAccessible(true); $prop->setValue($p, 1);

        $img = (new ProjectImage())->setImageUrl('https://example.com/img.png');

        $stubProj = new class($p) extends ProjectRepository {
            public function __construct(private Project $p) {}
            public function findAll() { return [$this->p]; }
        };
        $stubImg = new class($img) extends ProjectImageRepository {
            public function __construct(private ProjectImage $i) {}
            public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null) { return [$this->i]; }
        };

        $container->set(ProjectRepository::class, $stubProj);
        $container->set(ProjectImageRepository::class, $stubImg);

        $client->request('GET', '/api/projects');
        $this->assertResponseIsSuccessful();
        $data = json_decode($client->getResponse()->getContent(), true);
        $this->assertIsArray($data);
        $this->assertSame('T1', $data[0]['title']);
        $this->assertNotEmpty($data[0]['images']);
    }
}
