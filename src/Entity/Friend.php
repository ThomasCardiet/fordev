<?php

namespace App\Entity;

use App\Repository\FriendRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FriendRepository::class)
 */
class Friend
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="requestedFriends")
     * @ORM\JoinColumn(nullable=false)
     */
    private $user;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="acceptedFriends")
     * @ORM\JoinColumn(nullable=false)
     */
    private $friend;

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

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
    }

    public function getFriend(): ?User
    {
        return $this->friend;
    }

    public function setFriend(?User $friend): self
    {
        $this->friend = $friend;

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

    public function setAcceptedAt(\DateTimeImmutable $accepted_at): self
    {
        $this->accepted_at = $accepted_at;

        return $this;
    }
}
