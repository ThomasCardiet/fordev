<?php

namespace App\Repository;

use App\Entity\ProjectRole;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProjectRole|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectRole|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectRole[]    findAll()
 * @method ProjectRole[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectRoleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectRole::class);
    }

    // /**
    //  * @return ProjectRole[] Returns an array of ProjectRole objects
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
    public function findOneBySomeField($value): ?ProjectRole
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
