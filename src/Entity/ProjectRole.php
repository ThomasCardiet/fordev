<?php

namespace App\Entity;

use App\Repository\ProjectRoleRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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
    private $project;

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

    /**
     * @ORM\OneToMany(targetEntity=ProjectContributor::class, mappedBy="role")
     */
    private $contributorsWithRole;

    public function __construct()
    {
        $this->contributorsWithRole = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProject(): ?project
    {
        return $this->project;
    }

    public function setProject(?project $project): self
    {
        $this->project = $project;

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

    /**
     * @return Collection|ProjectContributor[]
     */
    public function getContributorsWithRole(): Collection
    {
        return $this->contributorsWithRole;
    }

    public function addContributorsWithRole(ProjectContributor $contributorsWithRole): self
    {
        if (!$this->contributorsWithRole->contains($contributorsWithRole)) {
            $this->contributorsWithRole[] = $contributorsWithRole;
            $contributorsWithRole->setRole($this);
        }

        return $this;
    }

    public function removeContributorsWithRole(ProjectContributor $contributorsWithRole): self
    {
        if ($this->contributorsWithRole->removeElement($contributorsWithRole)) {
            // set the owning side to null (unless already changed)
            if ($contributorsWithRole->getRole() === $this) {
                $contributorsWithRole->setRole(null);
            }
        }

        return $this;
    }
}
