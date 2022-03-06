<?php

namespace App\Repository;

use App\Entity\ProjectContributor;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProjectContributor|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectContributor|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectContributor[]    findAll()
 * @method ProjectContributor[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectContributorRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectContributor::class);
    }

    // /**
    //  * @return ProjectContributor[] Returns an array of ProjectContributor objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?ProjectContributor
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
