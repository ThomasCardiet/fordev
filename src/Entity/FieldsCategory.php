<?php

namespace App\Entity;

use App\Repository\FieldsCategoryRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=FieldsCategoryRepository::class)
 */
class FieldsCategory
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
     * @ORM\OneToMany(targetEntity=Fields::class, mappedBy="category")
     */
    private $fields;

    public function __construct()
    {
        $this->fields = new ArrayCollection();
    }

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

    /**
     * @return Collection|Fields[]
     */
    public function getFields(): Collection
    {
        return $this->fields;
    }

    public function addField(Fields $field): self
    {
        if (!$this->fields->contains($field)) {
            $this->fields[] = $field;
            $field->setCategory($this);
        }

        return $this;
    }

    public function removeField(Fields $field): self
    {
        if ($this->fields->removeElement($field)) {
            // set the owning side to null (unless already changed)
            if ($field->getCategory() === $this) {
                $field->setCategory(null);
            }
        }

        return $this;
    }
}
