<?php

namespace App\Tests\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthControllerTest extends WebTestCase
{
    public function testLoginWithValidCredentialsReturns200(): void
    {
        $client = static::createClient();
        $container = static::getContainer();

        $hash = password_hash('Admin123!', PASSWORD_BCRYPT);
        $user = (new User())->setEmail('admin@example.com')->setPasswordHash($hash);
        // Force id for session
        $ref = new \ReflectionClass($user);
        $prop = $ref->getProperty('id');
        $prop->setAccessible(true);
        $prop->setValue($user, 1);

        $stubRepo = new class($user) extends UserRepository {
            private User $user;
            public function __construct(User $user) { /* no parent */ $this->user = $user; }
            public function findOneBy(array $criteria, array $orderBy = null) { return $criteria['email'] === $this->user->getEmail() ? $this->user : null; }
        };
        $container->set(UserRepository::class, $stubRepo);

        $client->jsonRequest('POST', '/api/login', [
            'email' => 'admin@example.com',
            'password' => 'Admin123!'
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testLoginWithInvalidCredentialsReturns401(): void
    {
        $client = static::createClient();
        $container = static::getContainer();

        $hash = password_hash('Admin123!', PASSWORD_BCRYPT);
        $user = (new User())->setEmail('admin@example.com')->setPasswordHash($hash);

        $stubRepo = new class($user) extends UserRepository {
            private User $user;
            public function __construct(User $user) { $this->user = $user; }
            public function findOneBy(array $criteria, array $orderBy = null) { return $criteria['email'] === $this->user->getEmail() ? $this->user : null; }
        };
        $container->set(UserRepository::class, $stubRepo);

        $client->jsonRequest('POST', '/api/login', [
            'email' => 'admin@example.com',
            'password' => 'WrongPwd'
        ]);

        $this->assertResponseStatusCodeSame(401);
    }
}
