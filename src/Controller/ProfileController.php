<?php

namespace App\Controller;

use App\Entity\FMessage;
use App\Entity\Friend;
use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\ProjectRole;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
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
        /*NOT CONNECTED*/
        if (is_null($this->getUser())) {
            return $this->redirectToRoute('auth');
        }

        return $this->render('profile/index.html.twig');
    }
}