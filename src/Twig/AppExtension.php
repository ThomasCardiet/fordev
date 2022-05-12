<?php
// src/Twig/AppExtension.php
namespace App\Twig;

use App\Entity\Fields;
use App\Entity\Menu;
use Doctrine\ORM\EntityManager;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use App\Entity\User;

class AppExtension extends AbstractExtension
{
    private $em;

    public function __construct(EntityManager $em) {
        $this->em = $em;
    }

    //FILTERS
    public function getFilters()
    {
        return array(
            new TwigFilter('cast_to_array', array($this, 'objectFilter')),
        );
    }

    public function objectFilter($obj) {
        $array = [];
        foreach ((array)$obj as $key => $value) {
            $key = str_replace(User::class, '', $key);
            $array[$key] = $value;
        }
        return $array;
    }

    //FUNCTIONS
    public function getFunctions()
    {
        return [
            new TwigFunction('getField', [$this, 'getField']),
            new TwigFunction('isType', [$this, 'isType']),
            new TwigFunction('getRandomInt', [$this, 'getRandomInt']),
            new TwigFunction('getRoutes', [$this, 'getRoutes']),
        ];
    }

    public function getField($field_name)
    {
        $fields_repo = $this->em->getRepository(Fields::class);
        $field = $fields_repo->findOneBy(['name' => $field_name]);
        $field = $field ?? $fields_repo->findOneBy(['name' => str_replace('_', ' ', $field_name)]);
        return $field ? $field->getValue() : '';
    }

    public function isType($value, $type)
    {
        return gettype($value) === $type;
    }

    public function getRandomInt($min, $max) {
        return random_int($min, $max);
    }

    public function getRoutes()
    {
        $menus_repo = $this->em->getRepository(Menu::class);
        return $menus_repo->findAll();
    }
}