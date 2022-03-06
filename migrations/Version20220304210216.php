<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220304210216 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE project_role (id INT AUTO_INCREMENT NOT NULL, project_id_id INT DEFAULT NULL, color VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, permissions LONGBLOB NOT NULL, INDEX IDX_6EF842726C1197C9 (project_id_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE project_role ADD CONSTRAINT FK_6EF842726C1197C9 FOREIGN KEY (project_id_id) REFERENCES project (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE project_role');
    }
}
