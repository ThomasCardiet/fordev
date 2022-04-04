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

class AjaxController extends AbstractController
{

    /**
     * @Route("/ajax/{m}")
     * @param ManagerRegistry $managerRegistry
     * @param string $m
     * @param Request $request
     * @return Response
     */
    public function ajax(ManagerRegistry $managerRegistry, string $m, Request $request) : Response
    {
        $user = $this->getUser();

        /*Utilisateur non enregistré*/
        if(!$user) return $this->json([
            'code' => 403,
            'message' => 'Vous devez être connecté.'
        ], 403);

        $em = $managerRegistry->getManager();

        //REPOSITORIES
        $user_repo = $em->getRepository(User::class);
        $friends_repo = $em->getRepository(Friend::class);
        $projects_repo = $em->getRepository(Project::class);
        $contributors_repo = $em->getRepository(ProjectContributor::class);
        $roles_repo = $em->getRepository(ProjectRole::class);

        $data = [];
        $method_exist = true;

        $em = $managerRegistry->getManager();

        $RAW_QUERY = null;
        $executes = [];

        $fields = ['user_id' => $user->getId()];
        foreach ($request->request as $field => $value) {
            $fields[$field] = $value;
        }

        $user = $user_repo->find($fields['user_id']);

        switch ($m) {

            //GET METHODS

            /*USER*/
            case 'getUserInformations':

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' => [
                        'username' => $user->getUsername(),
                        'email' => $user->getEmail(),
                        'pp_path' => $user->getPpPath()
                    ]
                ];
                break;

            /*RELATIONS*/
            case 'getUnfriendUsers':

                $RAW_QUERY = "SELECT * FROM user
                                WHERE user.id NOT IN (SELECT friend.friend_id FROM friend
                                                        WHERE friend.user_id = :user_id)
                                AND user.id NOT IN (SELECT friend.user_id FROM friend
                                                        WHERE friend.friend_id = :user_id)
                                AND user.id != :user_id";

                $executes = ['user_id' => $fields['user_id']];

                break;
            case 'getFriendRequests':

                $RAW_QUERY = "SELECT * FROM friend
                                LEFT JOIN user ON friend.user_id = user.id
                                WHERE friend_id = :user_id and accepted = :accepted
                                AND user_id != :user_id";

                $executes = ['user_id' => $fields['user_id'], 'accepted' => false];
                break;
            case 'getFriends':

                $RAW_QUERY = "SELECT *, user.id AS target_id FROM user
                                LEFT JOIN friend ON (friend.user_id = :user_id AND friend.friend_id = user.id) 
                                    OR (friend.user_id = user.id AND friend.friend_id = :user_id)
                                WHERE user.id IN (SELECT friend.friend_id FROM friend
                                                      WHERE friend.user_id = :user_id
                                                      AND friend.accepted = :accepted)
                                OR user.id IN (SELECT friend.user_id FROM friend
                                                      WHERE friend.friend_id = :user_id
                                                      AND friend.accepted = :accepted)
                                AND user.id != :user_id";

                $executes = ['user_id' => $fields['user_id'], 'accepted' => true];

                break;

            case 'getPublicUsers':

                $RAW_QUERY = "SELECT * FROM user
                                WHERE user.public = :public
                                AND user.id != :user_id";

                $executes = ['user_id' => $fields['user_id'], 'public' => true];

                break;

            case 'getRecentConversations':

                $RAW_QUERY = "SELECT 
                                *
                                FROM fmessage
                                
                                JOIN
                                (select 
                                 max(created_at) maxtime,friend_id, 
                                 IF(:user_id = fmessage.owner_id, fmessage.friend_id, fmessage.owner_id) AS target 
                                FROM fmessage 
                                GROUP BY target) latest
                                on fmessage.created_at=latest.maxtime
                                
                                LEFT JOIN (
                                    SELECT
                                       user.id,
                                       user.pp_path
                                       FROM user
                                ) user ON user.id = target
                                
                                ORDER BY fmessage.created_at DESC
                                LIMIT 5";

                $executes = ['user_id' => $fields['user_id']];
                break;

            case 'getConversation':

                $RAW_QUERY = "SELECT 
                                    *,
                                    IF(:user_id = fmessage.owner_id, true, false) AS owned
                                FROM fmessage
                                
                                LEFT JOIN (
                                    SELECT
                                        user.id,
                                        user.pp_path,
                                        user.username as target_name
                                    FROM user
                                ) user ON user.id = fmessage.owner_id
                                
                                WHERE fmessage.owner_id = :user_id AND fmessage.friend_id = :friend_id
                                OR fmessage.friend_id = :user_id AND fmessage.owner_id = :friend_id
                                ORDER BY fmessage.created_at";

                $executes = ['user_id' => $fields['user_id'], 'friend_id' => $fields['target_id']];

                $data['target'] = [
                    'id' => $fields['target_id'],
                    'username' => $user_repo->find($fields['target_id'])->getUsername(),
                ];

                break;

            /*PROJECTS*/
            case 'getProjects':

                $RAW_QUERY = "SELECT *, true AS owner FROM project
                                LEFT JOIN
                                    (SELECT project_id AS pc_id, COUNT(*) AS contributors
                                     FROM project_contributor) pc
                                ON pc.pc_id = project.id
                                WHERE owner_id = :user_id
                                UNION
                                SELECT *, false AS owner FROM project
                                LEFT JOIN
                                    (SELECT project_id AS pc_id, COUNT(*) AS contributors
                                     FROM project_contributor) pc
                                ON pc.pc_id = project.id
                                WHERE id IN (SELECT project_id FROM project_contributor
                                                    WHERE contributor_id = :user_id
                                                    AND accepted = :accepted)";

                $executes = ['user_id' => $fields['user_id'], 'accepted' => true];

                break;

            case 'getContributorRequests':

                $RAW_QUERY = "SELECT * FROM project_contributor
                                LEFT JOIN (SELECT id as projectId, title, created_at, img_path FROM project) project ON projectId = project_contributor.project_id
                                WHERE contributor_id = :user_id and accepted = :accepted";

                $executes = ['user_id' => $fields['user_id'], 'accepted' => false];
                break;

            case 'getLastProjects':

                $RAW_QUERY = "SELECT *, true AS owner FROM project
                                LEFT JOIN
                                    (SELECT project_id AS pc_id, COUNT(*) AS contributors
                                     FROM project_contributor) pc
                                ON pc.pc_id = project.id
                                WHERE owner_id = :user_id
                                UNION
                                SELECT *, false AS owner FROM project
                                LEFT JOIN
                                    (SELECT project_id AS pc_id, COUNT(*) AS contributors
                                     FROM project_contributor) pc
                                ON pc.pc_id = project.id
                                WHERE id IN (SELECT project_id FROM project_contributor
                                                    WHERE contributor_id = :user_id
                                                    AND accepted = :accepted)
                                ORDER BY created_at DESC
                                LIMIT 5";

                $executes = ['user_id' => $fields['user_id'], 'accepted' => true];

                break;

            case 'getProject':

                $project = $projects_repo->find($fields['project_id']);
                $owner = $project->getOwner();

                $contributors = [];
                foreach ($project->getProjectContributors() as $projectContributor) {
                    $contributor = $projectContributor->getContributor();
                    $contributors[] = [
                        'id' => $contributor->getId(),
                        'username' => $contributor->getUsername()
                    ];
                }

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' =>
                        [
                            'id' => $project->getId(),
                            'title' => $project->getTitle(),
                            'description' => $project->getDescription(),
                            'img_path' => $project->getImgPath(),
                            'owner' => [
                                'id' => $owner->getId(),
                                'username' => $owner->getUsername()
                            ],
                            'contributors' => $contributors,

                            'created_at' => $project->getCreatedAt(),
                        ]
                ];

                break;

            case 'getRoles':

                $project = $projects_repo->find($fields['project_id']);

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' => []
                ];

                foreach ($project->getProjectRoles()->getValues() as $projectRole) {

                    $data['values'][] =
                        [
                            'id' => $projectRole->getId(),
                            'name' => $projectRole->getName(),
                            'color' => $projectRole->getColor(),
                        ];
                }

                break;

            case 'getContributors':

                $contributors = $contributors_repo->findBy(['project' => $fields['project_id'], 'accepted' => true]);

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' => []
                ];

                foreach ($contributors as $projectContributor) {

                    $contributor = $projectContributor->getContributor();

                    $role = $projectContributor->getRole();
                    if($role !== null) $role = $role->getId();
                    else $role = -1;

                    $data['values'][] =
                        [
                            'id' => $projectContributor->getId(),
                            'username' => $contributor->getUsername(),
                            'accepted_at' => $projectContributor->getAcceptedAt(),
                            'pp_path' => $contributor->getPpPath(),
                            'role_id' => $role,
                        ];
                }

                break;

            //ACTION METHODS

            /*USER*/
            case 'updateUser':

                $old_file = "img/profile/users/" . $user->getPpPath();
                if($user->getPpPath() !== null && file_exists($old_file)){unlink($old_file);}

                $file = $_FILES['file'];
                $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);

                $file_name = $user->getUsername() . '.' . strtolower($file_ext);
                $upload_path = "img/profile/users/" . $file_name;
                move_uploaded_file($file['tmp_name'], $upload_path);

                $user->setPpPath($file_name);
                $em->persist($user);
                $em->flush();


                $data = [
                    'code' => 200,
                    'msg' => 'Informations modifiées.',
                    'status' => 'success'
                ];
                break;

            /*RELATIONS*/
            case 'addFriend':

                $friend = empty($friends_repo->findOneBy(['user' => $fields['user_id'], 'friend' => $fields['target_id']])) ? $friends_repo->findOneBy(['friend' => $fields['user_id'], 'user' =>
                    $fields['target_id']]) : $friends_repo->findOneBy(['user' => $fields['user_id'], 'friend' => $fields['target_id']]);

                //Target
                $target = $user_repo->find($fields['target_id']);
                $target_username = $target->getUsername();

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'success'
                ];

                //ENVOIS DE REQUÊTE
                if(empty($friend)) {
                    $friend = new Friend();
                    $friend->setUser($user_repo->find($fields['user_id']))
                        ->setFriend($user_repo->find($fields['target_id']))
                        ->setAccepted(false)
                        ->setRequestedAt(new \DateTimeImmutable());

                    $data['msg'] = 'Requête envoyée avec succès';
                    $data['status'] = 'success';

                    //REQUÊTE EXISTE
                }else if(!$friend->getAccepted()) {

                    //DEJA ENVOYÉE
                    if($friend->getUser()->getId() === $fields['user_id']) {
                        $data['msg'] = "Vous avez déjà envoyé une requête à ${target_username}";

                        //ACCEPTER LA REQUÊTE
                    }else {
                        $friend->setAccepted(true)
                            ->setAcceptedAt(new \DateTimeImmutable());

                        $data['msg'] = "Vous êtes désormais en relation avec ${target_username}";
                        $data['status'] = 'success';
                    }

                    //DEJA EN RELATION
                }else {
                    $friend = null;
                    $data['msg'] = "Vous êtes déjà en relation avec ${target_username}";
                }

                if($friend !== null) {
                    $em->persist($friend);
                    $em->flush();
                }
                break;
            case 'removeFriend':

                $friend = empty($friends_repo->findOneBy(['user' => $fields['user_id'], 'friend' => $fields['target_id']])) ? $friends_repo->findOneBy(['friend' => $fields['user_id'], 'user' => $fields['target_id']]) : $friends_repo->findOneBy(['user' => $fields['user_id'], 'friend' => $fields['target_id']]);

                $target = $user_repo->find($fields['target_id']);

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                //RELATION EXISTE
                if(!empty($friend)) {
                    $em->remove($friend);
                    $em->flush();

                    //SELECTION DU MESSAGE SI REQUÊTE ACCEPTÉE OU NON
                    $data['msg'] = $friend->getAccepted() ? 'Relation supprimée avec ' . $target->getUsername() . '.' : 'Requête de relation avec ' . $target->getUsername() . ' supprimée.';
                    if($friend->getFriend()->getId() === $fields['user_id'] && !$friend->getAccepted()) $data['msg'] = 'Requête de relation avec ' . $target->getUsername() . ' refusée.';
                    $data['status'] = 'success';

                    //PAS EN RELATION
                }else {
                    $data['msg'] = "Vous n'êtes pas en relation avec " . $target->getUsername();
                }

                break;

            case 'sendMessage':

                $msg = $fields['msg'];
                $fMessage = new FMessage();
                $fMessage->setOwner($user_repo->find($fields['user_id']))
                    ->setFriend($user_repo->find($fields['target_id']))
                    ->setCreatedAt(new \DateTimeImmutable())
                    ->setContent($msg);

                $em->persist($fMessage);
                $em->flush();

                $data = [
                    'code' => 200,
                    'message' => 'Message envoyé avec succès',
                    'status' => 'success'
                ];
                break;

            case 'createProject':

                $project = new Project();

                $file = $_FILES['file'];
                $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);

                $file_name = $fields['user_id'] . '-' . clean($fields['title']) . '.' . strtolower($file_ext);
                $upload_path = "img/profile/projects/" . $file_name;
                move_uploaded_file($file['tmp_name'], $upload_path);

                $project->setImgPath($file_name)
                    ->setImgPath($file_name)
                    ->setTitle($fields['title'])
                    ->setDescription($fields['description'])
                    ->setOwner($user_repo->find($fields['user_id']))
                    ->setCreatedAt(new \DateTimeImmutable());

                $em->persist($project);
                $em->flush();


                $data = [
                    'code' => 200,
                    'msg' => 'Projet créé avec succès.',
                    'status' => 'success'
                ];

                break;

            case 'createRole':

                $role = new ProjectRole();

                $role->setName($fields['name'])
                    ->setColor($fields['color'])
                    ->setPermissions('')
                    ->setProject($projects_repo->find($fields['project_id']));

                $em->persist($role);
                $em->flush();


                $data = [
                    'code' => 200,
                    'msg' => 'Rôle créé avec succès.',
                    'status' => 'success'
                ];

                break;

            case 'removeRole':

                $role = $roles_repo->find($fields['role_id']);

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                //ROLE EXISTE
                if(!empty($role)) {
                    $em->remove($role);
                    $em->flush();

                    $data['msg'] = 'Le rôle ' . $role->getName() . ' a été supprimé.';
                    $data['status'] = 'success';

                }else {
                    $data['msg'] = "Ce role n'existe pas";
                }

                break;

            case 'updateContributor':

                $projectContributor = $contributors_repo->find($fields['target_id']);

                $projectContributor->setRole($roles_repo->find($fields['role_id']));

                $em->persist($projectContributor);
                $em->flush();

                $data = [
                    'code' => 200,
                    'msg' => 'Champ(s) modifiés.',
                    'status' => 'success'
                ];
                break;

            case 'removeContributor':

                $projectContributor = $contributors_repo->find($fields['target_id']);

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                //CONTRIBUTOR EXISTE
                if(!empty($projectContributor)) {
                    $em->remove($projectContributor);
                    $em->flush();

                    $data['msg'] = 'Le contributeur ' . $projectContributor->getContributor()->getUsername() . ' a été exclu.';
                    $data['status'] = 'success';

                }else {
                    $data['msg'] = "Ce contributeur n'est pas dans le projet.";
                }

                break;

            case 'addContributor':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                //CONTRIBUTOR N'EXISTE PAS
                if(empty($contributors_repo->find($fields['target_id']))) {
                    $target = $user_repo->find($fields['target_id']);
                    $projectContributor = new ProjectContributor();
                    $projectContributor->setRequestedAt(new \DateTimeImmutable())
                        ->setAccepted(false)
                        ->setContributor($target)
                        ->setProject($projects_repo->find($fields['project_id']));

                    $em->persist($projectContributor);
                    $em->flush();

                    $data['msg'] = 'Une invitation a été envoyée à ' . $target->getUsername() . '.';
                    $data['status'] = 'success';

                }else {
                    $data['msg'] = "Ce contributeur est déjà dans le projet.";
                }

                break;

            default:
                $method_exist = false;
                break;
        }

        if($RAW_QUERY !== null) {

            //LIST FILTER
            if(isset($fields['filter'])) {
                switch ($fields['filter']) {
                    case 'contributors':
                        $RAW_QUERY .= " AND user.id NOT IN (SELECT id FROM project_contributor WHERE user.id = project_contributor.id)";
                        break;
                }
            }

            //SEARCH
            if(isset($fields['search'])) $RAW_QUERY .= " AND user.username LIKE '%" . $fields['search'] . "%'";

            $statement = $em->getConnection()->prepare($RAW_QUERY);
            $statement->execute($executes);
            $results = $statement->fetchAll();

            $data['code'] = 200;
            $data['status'] = 'success';
            $data['values'] = $results;
        }

        if($method_exist) {
            return $this->json([
                'data' => $data,
            ], $data['code']);
        }

        return $this->json([
            'message' => 'La méthode demandée est introuvable.',
            'methode' => $m
        ], 403);
    }
}

//REMOVE SPACES AND SPECIAL CHARS OF STRING
function clean($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.

    return preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
}

