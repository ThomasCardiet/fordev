<?php

namespace App\Controller;

use App\Entity\FMessage;
use App\Entity\Friend;
use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\ProjectRole;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Monolog\DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProfileController extends AbstractController
{
    /**
     * @Route("/profile", name="profile")
     * @param ManagerRegistry $managerRegistry
     * @return Response
     */
    public function index(ManagerRegistry $managerRegistry): Response
    {
        $user = $this->getUser();

        /*NOT CONNECTED*/
        if (is_null($user)) {
            return $this->redirectToRoute('auth');
        }

        $stats = [
            'glories' => $user->getGlory(),
            'projects' => count($user->getOwnedProjects()),
            'weeks' => floor($user->getCreatedAt()->diff(new \DateTime())->days/7)
        ];

        return $this->render('profile/index.html.twig', [
            'stats' => $stats
        ]);
    }
}