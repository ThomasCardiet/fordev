<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220307131913 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project_contributor ADD role_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE project_contributor ADD CONSTRAINT FK_12A06068D60322AC FOREIGN KEY (role_id) REFERENCES project_role (id)');
        $this->addSql('CREATE INDEX IDX_12A06068D60322AC ON project_contributor (role_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE project_contributor DROP FOREIGN KEY FK_12A06068D60322AC');
        $this->addSql('DROP INDEX IDX_12A06068D60322AC ON project_contributor');
        $this->addSql('ALTER TABLE project_contributor DROP role_id');
    }
}
