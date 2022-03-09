<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProjectRepository::class)
 */
class Project
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $title;

    /**
     * @ORM\Column(type="text")
     */
    private $description;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="ownedProjects")
     */
    private $owner;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private $created_at;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $img_path;

    /**
     * @ORM\OneToMany(targetEntity=ProjectContributor::class, mappedBy="project")
     */
    private $projectContributors;

    /**
     * @ORM\OneToMany(targetEntity=ProjectRole::class, mappedBy="project")
     */
    private $projectRoles;

    public function __construct()
    {
        $this->projectContributors = new ArrayCollection();
        $this->projectRoles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): self
    {
        $this->title = $title;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): self
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getImgPath(): ?string
    {
        return $this->img_path;
    }

    public function setImgPath(?string $img_path): self
    {
        $this->img_path = $img_path;

        return $this;
    }

    /**
     * @return Collection|ProjectContributor[]
     */
    public function getProjectContributors(): Collection
    {
        return $this->projectContributors;
    }

    public function isInProject($user) {

        if($this->owner->getId() === $user->getId()) return true;

        foreach ($this->projectContributors->getValues() as $projectContributor) {
            if($projectContributor->getContributor()->getId() === $user->getId()) return true;
        }

        return false;
    }

    public function isOwner($user) {

        if($this->owner->getId() === $user->getId()) return true;

        return false;
    }

    public function addProjectContributor(ProjectContributor $projectContributor): self
    {
        if (!$this->projectContributors->contains($projectContributor)) {
            $this->projectContributors[] = $projectContributor;
            $projectContributor->setProject($this);
        }

        return $this;
    }

    public function removeProjectContributor(ProjectContributor $projectContributor): self
    {
        if ($this->projectContributors->removeElement($projectContributor)) {
            // set the owning side to null (unless already changed)
            if ($projectContributor->getProject() === $this) {
                $projectContributor->setProject(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection|ProjectRole[]
     */
    public function getProjectRoles(): Collection
    {
        return $this->projectRoles;
    }

    public function addProjectRole(ProjectRole $projectRole): self
    {
        if (!$this->projectRoles->contains($projectRole)) {
            $this->projectRoles[] = $projectRole;
            $projectRole->setProjectId($this);
        }

        return $this;
    }

    public function removeProjectRole(ProjectRole $projectRole): self
    {
        if ($this->projectRoles->removeElement($projectRole)) {
            // set the owning side to null (unless already changed)
            if ($projectRole->getProjectId() === $this) {
                $projectRole->setProjectId(null);
            }
        }

        return $this;
    }
}
