<?php

namespace App\Controller;

use App\Entity\FMessage;
use App\Entity\Friend;
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
        if(is_null($this->getUser())) {
            return $this->redirectToRoute('auth');
        }

        return $this->render('profile/index.html.twig');
    }

    /**
     * @Route("/profile/ajax/{m}")
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
        $fMessages_repo = $em->getRepository(FMessage::class);

        $data = [];
        $method_exist = true;

        $em = $managerRegistry->getManager();

        $RAW_QUERY = null;
        $executes = [];

        $user_id = $user->getId();
        $friend_id = $request->request->get('target_id');

        $user = $user_repo->find($user_id);

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

                $executes = ['user_id' => $user_id, 'accepted' => true];
                break;
            case 'getFriendRequests':

                $RAW_QUERY = "SELECT * FROM friend
                                LEFT JOIN user ON friend.user_id = user.id
                                WHERE friend_id = :user_id and accepted = :accepted
                                AND user_id != :user_id";

                $executes = ['user_id' => $user_id, 'accepted' => false];
                break;
            case 'getFriends':

                $friends_with = $friends_repo->findBy(['friend' => $user_id, 'accepted' => true]);
                $friends_by = $friends_repo->findBy(['user' => $user_id, 'accepted' => true]);
                $friends = array_merge($friends_with, $friends_by);

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' => []
                ];

                foreach ($friends as $friend) {
                    $target = $friend->getUser()->getId() === $user_id ? $friend->getFriend() : $friend->getUser();

                    $data['values'][] =
                    [
                        'id' => $target->getId(),
                        'username' => $target->getUsername(),
                        'created_at' => $target->getCreatedAt(),
                        'pp_path' => $target->getPpPath(),

                        'requested_at' => $friend->getRequestedAt(),
                        'accepted_at' => $friend->getAcceptedAt(),
                    ];
                }
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

                $executes = ['user_id' => $user_id];
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

                $executes = ['user_id' => $user_id, 'friend_id' => $friend_id];

                $data['target'] = [
                    'id' => $friend_id,
                    'username' => $user_repo->find($friend_id)->getUsername(),
                ];

                break;

            //ACTION METHODS

                /*USER*/
            case 'updateUser':

                $old_file = "img/profile/users/" . $user->getPpPath();
                if(file_exists($old_file)){unlink($old_file);}

                $file = $_FILES['profile_img'];
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

                $friend = empty($friends_repo->findOneBy(['user' => $user_id, 'friend' => $friend_id])) ? $friends_repo->findOneBy(['friend' => $user_id, 'user' => $friend_id]) : $friends_repo->findOneBy(['user' => $user_id, 'friend' => $friend_id]);

                //Target
                $target = $user_repo->find($friend_id);
                $target_username = $target->getUsername();

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'success'
                ];

                //ENVOIS DE REQUÊTE
                if(empty($friend)) {
                    $friend = new Friend();
                    $friend->setUser($user_repo->find($user_id))
                        ->setFriend($user_repo->find($friend_id))
                        ->setAccepted(false)
                        ->setRequestedAt(new \DateTimeImmutable());

                    $data['msg'] = 'Requête envoyée avec succès';
                    $data['status'] = 'success';

                //REQUÊTE EXISTE
                }else if(!$friend->getAccepted()) {

                    //DEJA ENVOYÉE
                    if($friend->getUser()->getId() === $user_id) {
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

                $friend = empty($friends_repo->findOneBy(['user' => $user_id, 'friend' => $friend_id])) ? $friends_repo->findOneBy(['friend' => $user_id, 'user' => $friend_id]) : $friends_repo->findOneBy(['user' => $user_id, 'friend' => $friend_id]);

                $target = $user_repo->find($friend_id);

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
                    if($friend->getFriend()->getId() === $user_id && !$friend->getAccepted()) $data['msg'] = 'Requête de relation avec ' . $target->getUsername() . ' refusée.';
                    $data['status'] = 'success';

                //PAS EN RELATION
                }else {
                    $data['msg'] = "Vous n'êtes pas en relation avec " . $target->getUsername();
                }

                break;

            case 'sendMessage':

                $msg = $request->request->get('msg');
                $fMessage = new FMessage();
                $fMessage->setOwner($user_repo->find($user_id))
                    ->setFriend($user_repo->find($friend_id))
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

            default:
                $method_exist = false;
                break;
        }

        if($RAW_QUERY !== null) {
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
