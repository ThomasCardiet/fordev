<?php

namespace App\Entity;

use App\Repository\ProjectRoleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProjectRoleRepository::class)
 */
class ProjectRole
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=project::class, inversedBy="projectRoles")
     */
    private $project_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $color;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $name;

    /**
     * @ORM\Column(type="blob")
     */
    private $permissions;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProjectId(): ?project
    {
        return $this->project_id;
    }

    public function setProjectId(?project $project_id): self
    {
        $this->project_id = $project_id;

        return $this;
    }

    public function getColor(): ?string
    {
        return $this->color;
    }

    public function setColor(string $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getPermissions()
    {
        return $this->permissions;
    }

    public function setPermissions($permissions): self
    {
        $this->permissions = $permissions;

        return $this;
    }
}
