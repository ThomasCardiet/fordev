<?php

namespace App\Entity;

use App\Repository\ProjectContributorRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProjectContributorRepository::class)
 */
class ProjectContributor
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=project::class, inversedBy="projectContributors")
     */
    private $project;

    /**
     * @ORM\ManyToOne(targetEntity=user::class, inversedBy="contributedProjects")
     */
    private $contributor;

    /**
     * @ORM\Column(type="boolean")
     */
    private $accepted;

    /**
     * @ORM\Column(type="datetime_immutable")
     */
    private $requested_at;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $accepted_at;

    /**
     * @ORM\ManyToOne(targetEntity=projectRole::class, inversedBy="contributorsWithRole")
     */
    private $role;

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

    public function getContributor(): ?user
    {
        return $this->contributor;
    }

    public function setContributor(?user $contributor): self
    {
        $this->contributor = $contributor;

        return $this;
    }

    public function getAccepted(): ?bool
    {
        return $this->accepted;
    }

    public function setAccepted(bool $accepted): self
    {
        $this->accepted = $accepted;

        return $this;
    }

    public function getRequestedAt(): ?\DateTimeImmutable
    {
        return $this->requested_at;
    }

    public function setRequestedAt(\DateTimeImmutable $requested_at): self
    {
        $this->requested_at = $requested_at;

        return $this;
    }

    public function getAcceptedAt(): ?\DateTimeImmutable
    {
        return $this->accepted_at;
    }

    public function setAcceptedAt(?\DateTimeImmutable $accepted_at): self
    {
        $this->accepted_at = $accepted_at;

        return $this;
    }

    public function getRole(): ?projectRole
    {
        return $this->role;
    }

    public function setRole(?projectRole $role): self
    {
        $this->role = $role;

        return $this;
    }
}
