<?php

namespace App\Entity;

use App\Repository\FieldsRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FieldsRepository::class)
 */
class Fields
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
    private $name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $value;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="lastEditedFields")
     */
    private $lastUserEdit;

    /**
     * @ORM\Column(type="datetime_immutable", nullable=true)
     */
    private $edited_at;

    /**
     * @ORM\ManyToOne(targetEntity=FieldsCategory::class, inversedBy="fields")
     */
    private $category;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getLastUserEdit(): ?user
    {
        return $this->lastUserEdit;
    }

    public function setLastUserEdit(?user $lastUserEdit): self
    {
        $this->lastUserEdit = $lastUserEdit;

        return $this;
    }

    public function getEditedAt(): ?\DateTimeImmutable
    {
        return $this->edited_at;
    }

    public function setEditedAt(\DateTimeImmutable $edited_at): self
    {
        $this->edited_at = $edited_at;

        return $this;
    }

    public function getCategory(): ?fieldsCategory
    {
        return $this->category;
    }

    public function setCategory(?fieldsCategory $category): self
    {
        $this->category = $category;

        return $this;
    }
}
