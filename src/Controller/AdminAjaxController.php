<?php

namespace App\Controller;

use App\Entity\Fields;
use App\Entity\FieldsCategory;
use App\Entity\ForumCategory;
use App\Entity\Friend;
use App\Entity\Menu;
use App\Entity\Project;
use App\Entity\ProjectContributor;
use App\Entity\ProjectRole;
use App\Entity\User;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class AdminAjaxController extends AbstractController
{

    /**
     * @Route("/admin/ajax/{m}")
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
        $fields_category_repo = $em->getRepository(FieldsCategory::class);
        $fields_repo = $em->getRepository(Fields::class);
        $menu_repo = $em->getRepository(Menu::class);
        $category_repo = $em->getRepository(ForumCategory::class);

        $data = [];
        $method_exist = true;

        $em = $managerRegistry->getManager();

        $RAW_QUERY = null;
        $executes = [];

        $fields = ['user_id' => $user->getId()];
        foreach ($request->request as $field => $value) {
            $fields[$field] = $value;
        }

        // METHODS
        switch ($m) {

            //GET METHODS

            case 'getFieldCategories':

                $RAW_QUERY = "SELECT * FROM fields_category";

                $executes = [];

                break;

            case 'getFields':

                $RAW_QUERY = "SELECT * FROM fields
                                LEFT JOIN (SELECT id as user_id, username as last_user_edit_username FROM user) user
                                ON user.user_id = fields.last_user_edit_id";

                $executes = [];

                break;

            case 'getMenus':

                $RAW_QUERY = "SELECT * FROM menu
                                LEFT JOIN (SELECT id as user_id, username as last_user_edit_username FROM user) user
                                ON user.user_id = menu.last_user_edit_id";

                $executes = [];

                break;

            case 'getForumCategories':

                $RAW_QUERY = "SELECT * FROM forum_category";

                $executes = [];

                break;

            case 'getFile':

                $data = [
                    'code' => 200,
                    'status' => 'success',
                    'values' => file_get_contents($fields['path'])
                ];

                break;

            //ACTION METHODS
            case 'createFieldCategory':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                if(empty($fields_category_repo->findBy(['name' => $fields['category_name']]))) {

                    $field_category = new FieldsCategory();
                    $field_category->setName($fields['category_name']);

                    $em->persist($field_category);
                    $em->flush();

                    $data['msg'] = "Vous avez crée la catégorie '" . $fields['category_name'] . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "La catégorie '" . $fields['category_name'] . "' existe déjà.";

                }

                break;

            case 'removeFieldCategory':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                $field_category = $fields_category_repo->find($fields['category_id']);
                if(!empty($field_category)) {

                    foreach ($field_category->getFields() as $field) {
                        $em->remove($field);
                    }

                    $em->remove($field_category);
                    $em->flush();

                    $data['msg'] = "Vous avez supprimé la catégorie '" . $field_category->getName() . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "La catégorie n'existe pas.";

                }

                break;

            case 'createField':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                if(empty($fields_repo->findBy(['name' => $fields['field_name']]))) {

                    $field = new Fields();
                    $field->setName($fields['field_name'])
                        ->setValue($fields['field_value'])
                        ->setCategory($fields_category_repo->find($fields['category_id']))
                        ->setLastUserEdit($this->getUser())
                        ->setEditedAt(new \DateTimeImmutable());

                    $em->persist($field);
                    $em->flush();

                    $data['msg'] = "Vous avez crée le champ '" . $fields['field_name'] . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "Le champ '" . $fields['field_name'] . "' existe déjà.";

                }

                break;

            case 'removeField':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                $field = $fields_repo->find($fields['field_id']);
                if(!empty($field)) {

                    $em->remove($field);
                    $em->flush();

                    $data['msg'] = "Vous avez supprimé le champ '" . $field->getName() . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "Le champ n'existe pas.";

                }

                break;

            case 'updateField':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                $field = $fields_repo->find($fields['field_id']);
                if(!empty($field)) {

                    $field->setValue($fields['field_value'])
                        ->setLastUserEdit($this->getUser())
                        ->setEditedAt(new \DateTimeImmutable());

                    $em->persist($field);
                    $em->flush();

                    $data['msg'] = "Vous avez modifié le champ '" . $field->getName() . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "Le champ n'existe pas.";

                }

                break;

            case 'createMenu':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                if(empty($menu_repo->findBy(['name' => $fields['menu_name']]))) {

                    $menu = new Menu();
                    $menu->setName($fields['menu_name'])
                        ->setPath($fields['menu_path'])
                        ->setLastUserEdit($this->getUser())
                        ->setEditedAt(new \DateTimeImmutable());

                    $em->persist($menu);
                    $em->flush();

                    $data['msg'] = "Vous avez ajouté le menu '" . $fields['menu_name'] . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "Le menu '" . $fields['menu_name'] . "' existe déjà.";

                }

                break;

            case 'removeMenu':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                $menu = $menu_repo->find($fields['menu_id']);
                if(!empty($menu)) {

                    $em->remove($menu);
                    $em->flush();

                    $data['msg'] = "Vous avez supprimé le menu '" . $menu->getName() . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "Le menu n'existe pas.";

                }

                break;

            case 'createForumCategory':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                if(empty($category_repo->findBy(['name' => $fields['category_name']]))) {

                    $category = new ForumCategory();
                    $category->setName($fields['category_name']);

                    $em->persist($category);
                    $em->flush();

                    $data['msg'] = "Vous avez ajouté la catégorie '" . $fields['category_name'] . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "La catégorie '" . $fields['category_name'] . "' existe déjà.";

                }

                break;

            case 'removeForumCategory':

                $data = [
                    'code' => 200,
                    'msg' => '',
                    'status' => 'error'
                ];

                $category = $category_repo->find($fields['category_id']);
                if(!empty($category)) {

                    $em->remove($category);
                    $em->flush();

                    $data['msg'] = "Vous avez supprimé la catégorie '" . $category->getName() . "'.";
                    $data['status'] = 'success';

                }else {

                    $data['msg'] = "La catégorie n'existe pas.";

                }

                break;

            case 'updateFile':

                $data = [
                    'code' => 200,
                    'msg' => 'Fichier modifié avec succès',
                    'status' => 'error'
                ];

                if(isset($fields['path'], $fields['value']) && !empty($fields['path']) && !empty($fields['value'])) {
                    file_put_contents($fields['path'], $fields['value']);
                    $data['msg'] = 'Fichier modifié avec succès';
                    $data['status'] = 'success';
                    break;
                }

                $data['msg'] = 'Vous devez sélectionner un fichier.';

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
