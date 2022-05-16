<?php

namespace App\Controller;

use App\Entity\ForumCategory;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ForumController extends AbstractController
{
    /**
     * @Route("/forum", name="forum")
     */
    public function index(ManagerRegistry $managerRegistry): Response
    {
        $em = $managerRegistry->getManager();
        $forum_category_repo = $em->getRepository(ForumCategory::class);

        return $this->render('forum/index.html.twig', [
            'categories' => $forum_category_repo->findAll()
        ]);
    }

    /**
     * @Route("/new-topic", name="create_topic")
     */
    public function newTopic(ManagerRegistry $managerRegistry): Response
    {
        $em = $managerRegistry->getManager();
        $forum_category_repo = $em->getRepository(ForumCategory::class);

        return $this->render('forum/new-topic.html.twig', [
            'categories' => $forum_category_repo->findAll()
        ]);
    }

    /**
     * @Route("/view-topic", name="view_topic")
     */
    public function viewTopic(ManagerRegistry $managerRegistry): Response
    {
        $em = $managerRegistry->getManager();

        return $this->render('forum/view-topic.html.twig');
    }
}