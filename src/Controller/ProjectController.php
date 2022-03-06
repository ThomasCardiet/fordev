<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Monolog\DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ProjectController extends AbstractController
{
    /**
     * @Route("/project/{id}", name="project")
     * @param Project $project
     * @return Response
     */
    public function index(Project $project, ManagerRegistry $managerRegistry): Response
    {
        $user = $this->getUser();

        /*NOT CONNECTED*/
        if(is_null($user)) {
            return $this->redirectToRoute('auth');
        }

        /*NOT IN PROJECT*/
        if(!$project->isInProject($user)) {
            return $this->redirectToRoute('home');
        }

        return $this->render('project/index.html.twig', [
            'project' => $project,
            'projectContributors' => $project->getProjectContributors()->getValues()
        ]);
    }
}
