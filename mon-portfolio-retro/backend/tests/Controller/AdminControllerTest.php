<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Entity\Contact;
use App\Repository\UserRepository;
use App\Repository\ContactRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AdminControllerTest extends WebTestCase
{
    private function stubUser(): User
    {
        $user = (new User())->setEmail('admin@example.com')->setPasswordHash(password_hash('x', PASSWORD_BCRYPT));
        $ref = new \ReflectionClass($user);
        $prop = $ref->getProperty('id');
        $prop->setAccessible(true);
        $prop->setValue($user, 42);
        return $user;
    }

    public function testMe401WithoutSession(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/me');
        $this->assertResponseStatusCodeSame(401);
    }

    public function testMe200WithSession(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        $user = $this->stubUser();
        $stubUsers = new class($user) extends UserRepository {
            public function __construct(private User $user) {}
            public function find($id, $lockMode = null, $lockVersion = null) { return $id === 42 ? $this->user : null; }
        };
        $container->set(UserRepository::class, $stubUsers);

        $session = $container->get('session');
        $session->set('user_id', 42);
        $session->save();
        $client->getCookieJar()->set(new \Symfony\Component\BrowserKit\Cookie($session->getName(), $session->getId()));

        $client->request('GET', '/api/me');
        $this->assertResponseIsSuccessful();
    }

    public function testMessages401WithoutSession(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/messages');
        $this->assertResponseStatusCodeSame(401);
    }

    public function testMessages200WithSession(): void
    {
        $client = static::createClient();
        $container = static::getContainer();
        // stub user for session
        $user = $this->stubUser();
        $stubUsers = new class($user) extends UserRepository {
            public function __construct(private User $user) {}
            public function find($id, $lockMode = null, $lockVersion = null) { return $id === 42 ? $this->user : null; }
        };
        $container->set(UserRepository::class, $stubUsers);

        // stub contacts
        $c1 = new Contact();
        $rc = new \ReflectionClass($c1); $p = $rc->getProperty('id'); $p->setAccessible(true); $p->setValue($c1, 1);
        $c1->setName('Alice')->setEmail('a@a.tld')->setPhone('123')->setMessage('Hello');
        $stubContacts = new class($c1) extends ContactRepository {
            public function __construct(private Contact $c1) {}
            public function findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null) { return [$this->c1]; }
        };
        $container->set(ContactRepository::class, $stubContacts);

        $session = $container->get('session');
        $session->set('user_id', 42);
        $session->save();
        $client->getCookieJar()->set(new \Symfony\Component\BrowserKit\Cookie($session->getName(), $session->getId()));

        $client->request('GET', '/api/messages');
        $this->assertResponseIsSuccessful();
    }
}
