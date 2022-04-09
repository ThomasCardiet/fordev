<?php

namespace App\Controller;

use App\Entity\Fields;
use App\Entity\FieldsCategory;
use App\Entity\FMessage;
use App\Entity\Friend;
use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminController extends AbstractController
{
    /**
     * @Route("/admin", name="admin")
     * @param ManagerRegistry $managerRegistry
     * @return Response
     */
    public function index(ManagerRegistry $managerRegistry, $page_name, $parameter): Response
    {

        // ACCESS VERIFICATION
        if (!$this->getUser()) {
            return $this->redirectToRoute('profile');
        }

        if($page_name === null) $page_name = "dashboard";

        $em = $managerRegistry->getManager();

        //REPOSITORIES
        $user_repo = $em->getRepository(User::class);
        $projects_repo = $em->getRepository(Project::class);
        $contributor_repo = $em->getRepository(ProjectContributor::class);
        $friend_repo = $em->getRepository(Friend::class);
        $fMessage_repo = $em->getRepository(FMessage::class);
        $fields_repo = $em->getRepository(Fields::class);
        $fieldsCategory_repo = $em->getRepository(FieldsCategory::class);

        /* #### COLORS LISTS ####
            warning => jaune
            info => bleu
            success => vert
            dark => noir
            danger => rouge
            secondary => gris
            light => blanc
        */

        $datas = [
            'users' => [
              'name' => 'Utilisateurs',
              'values' => $user_repo->findAll(),
              'icon' => 'users',
              'color' => 'warning'
            ],
            'projects' => [
              'name' => 'Projets',
              'values' => $projects_repo->findAll(),
              'icon' => 'project-diagram',
              'color' => 'info'
            ],
            'contributors' => [
                'name' => 'Contributeurs',
                'values' => $contributor_repo->findAll(),
                'icon' => 'donate',
                'color' => 'success'
            ],
            'relations' => [
                'name' => 'Relations',
                'values' => $friend_repo->findAll(),
                'icon' => 'heart',
                'color' => 'light'
            ],
            'fMessages' => [
                'name' => 'Friend Messages',
                'values' => $fMessage_repo->findAll(),
                'icon' => 'comment',
                'color' => 'light'
            ],
            'topics' => [
                'name' => 'Topics',
                'values' => [],
                'icon' => 'file-word',
                'color' => 'danger'
            ],
        ];

        $field_categories = $fieldsCategory_repo->findAll();
        $field_categories[] = [
            'id' => -1,
            'name' => 'Others',
            'fields' => [
                'values' => $fields_repo->findBy(['category' => null])
            ]
        ];

        $variables = [
            'page_name' => $page_name,
            'datas' => $datas,
        ];

        // SET PAGES DATA
        switch ($page_name) {

            // FIELDS MODIFICATIONS
            case 'fields':

                $variables = array_merge($variables, [
                    'datas' => $datas,
                    'fields' => $fields_repo->findAll(),
                    'field_categories' => $field_categories
                ]);

                break;

            // USER INFORMATIONS
            case 'user':

                $variables = array_merge($variables, [
                    'user' => $user_repo->find($parameter),
                    'update_fields' => [
                        'name',
                        'surname',
                        'username',
                        'email',
                        'pp_path',
                        'public',
                        'glory'
                    ]
                ]);

                break;

            // TEMPLATES MODIFICATION
            case 'templates':

                function getFiles($path) {
                    $files = scandir($path);
                    $array = [];
                    foreach ($files as $file) {
                        switch (true) {
                            case str_contains($file, '.html.twig'):
                                $array[$file] = $path;
                                break;

                            case !str_contains($file, '.'):
                                $array[$file] = getFiles($path . "/" . $file);
                                break;

                        }
                    }

                    return $array;
                }


                $variables = array_merge($variables, [
                    'templates' => getFiles("../templates")
                ]);

                break;
        }

        return $this->render('admin/index.html.twig', $variables);
    }
}
