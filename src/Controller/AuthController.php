<?php

namespace App\Controller;

use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class AuthController extends AbstractController
{
    /**
     * @Route("/auth", name="auth")
     */
    public function index(Request $request, ManagerRegistry $managerRegistry, UserPasswordEncoderInterface $encoder): Response
    {

        if ($this->getUser()) {
            return $this->redirectToRoute('profile');
        }

        $em = $managerRegistry->getManager();
        $user_repo = $em->getRepository(User::class);

        $user = new User();
        $p = $request->request;

        $errors = [];
        if($p !== null) {

            /*LOGIN PART*/
            if($p->get('login_submit') !== null) {

                $login = $p->get('user_login');
                $password = $p->get('user_password');
                $errors['type'] = 'login';

                //ERRORS
                $user = null;
                if(!empty($login)) {
                    $filter = filter_var($login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
                    $user = $user_repo->findOneBy([$filter => $login]);
                }else {
                    $errors['login'] = ['Ce champ est obligatoire'];
                }

                if(!empty($password)) {
                    if($user !== null) {
                        if($encoder->isPasswordValid($user, $password)) {
                            $this->loginUser($user);
                        }else {
                            $errors['password'][] = 'Mot de passe incorrect';
                        }
                    }else {
                        $errors['login'][] = 'Identifiant ou Email introuvable';
                    }
                }else {
                    $errors['password'] = ['Ce champ est obligatoire'];
                }
            }

            /*REGISTER PART*/
            if($p->get('register_submit') !== null) {

                $fields = [
                    'username' => ['value' => $p->get('user_username'), 'foreign' => true],
                    'email' => ['value' => $p->get('user_email'), 'foreign' => true],
                    'name' => ['value' => $p->get('user_name'), 'foreign' => false],
                    'surname' => ['value' => $p->get('user_surname'), 'foreign' => false],
                    'password' => ['value' => $p->get('user_password'), 'foreign' => false],
                    'confirm_password' => ['value' => $p->get('user_confirm_password'), 'foreign' => false],
                ];
                $errors['type'] = 'register';

                // ERRORS
                foreach ($fields as $key => $value) {
                    if (empty($value['value'])) {
                        $errors[$key] = ['Ce champ est obligatoire'];
                        continue;
                    }
                    switch ($key) {
                        case 'password':
                            if ($value !== $fields['confirm_password']) {
                                $errors[$key][] = 'Les mots de passe ne correspondent pas';
                            }
                            break;
                        default:
                            if ($value['foreign']) {
                                $search = $user_repo->findBy([$key => $value['value']]);
                                if (!empty($search)) {
                                    $errors[$key][] = ucfirst($key) . ' déjà utilisé';
                                }
                            }
                            break;
                    }
                }

                /*ADD USER*/

                if (sizeof($errors) === 1) {
                    $user->setUsername($fields['username']['value'])
                        ->setEmail($fields['email']['value'])
                        ->setName($fields['name']['value'])
                        ->setSurname($fields['surname']['value'])
                        ->setPassword($encoder->encodePassword($user, $fields['password']['value']))
                        ->setCreatedAt(new \DateTimeImmutable())
                        ->setPublic(false)
                        ->setGlory(0);

                    $em->persist($user);

                    //PROJECT INVITATION
                    if(!empty($p->get('project_id'))) {
                        $project_repo = $em->getRepository(Project::class);
                        $project = $project_repo->find($p->get('project_id'));
                        if($project !== null) {
                            $contributor = new ProjectContributor();
                            $contributor->setProject($project)
                                ->setContributor($user)
                                ->setAccepted(true)
                                ->setAcceptedAt(new \DateTimeImmutable())
                                ->setRequestedAt(new \DateTimeImmutable());

                            $em->persist($contributor);
                        }
                    }

                    $em->flush();

                    $this->loginUser($user);
                }
            }
        }

        if ($this->getUser()) {
            return $this->redirectToRoute('home');
        }

        //Generate Username
        if(isset($_GET['name'], $_GET['surname'])) {
            $name = substr($_GET['name'], 0, round(strlen($_GET['name'])/2));
            $surname = substr($_GET['surname'], 0, round(strlen($_GET['surname'])/2));
            $_GET['username'] = $name . $surname . rand(10, 1000);
        }

        return $this->render('auth/index.html.twig', [
            'errors' => $errors,
            'params' => $_GET
        ]);
    }

    /**
     * @Route("/deconnexion", name="security_logout")
     */
    public function logout() {}

    public function loginUser($user): void
    {
        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());
        $this->get('security.token_storage')->setToken($token);
        $this->redirectToRoute('home');

        // If the firewall name is not main, then the set value would be instead:
        // $this->get('session')->set('_security_XXXFIREWALLNAMEXXX', serialize($token));
        $this->get('session')->set('_security_main', serialize($token));

        // Fire the login event manually
        /*$event = new InteractiveLoginEvent($request, $token);
        $this->get("event_dispatcher")->dispatch("security.interactive_login", $event);*/
    }
}