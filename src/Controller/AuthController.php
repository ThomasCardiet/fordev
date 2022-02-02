<?php

namespace App\Controller;

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
                                if (isset($search)) {
                                    $errors[$key][] = ucfirst($key) . ' déjà utilisé';
                                }
                            }
                            break;
                    }
                }

                /*ADD USER*/
                if (empty($errors)) {
                    $user->setUsername($fields['username']['value']);
                    $user->setEmail($fields['email']['value']);
                    $encoded = $encoder->encodePassword($user, $fields['password']['value']);
                    $user->setPassword($encoded);
                    $user->setCreatedAt(new \DateTimeImmutable());

                    $em->persist($user);
                    $em->flush();

                    $this->loginUser($user);
                }
            }
        }

        if ($this->getUser()) {
            return $this->redirectToRoute('home');
        }

        return $this->render('auth/index.html.twig', ['errors' => $errors]);
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
