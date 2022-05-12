<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220512101042 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE menu ADD last_user_edit_id INT DEFAULT NULL, ADD edited_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE menu ADD CONSTRAINT FK_7D053A936F03ABFB FOREIGN KEY (last_user_edit_id) REFERENCES user (id)');
        $this->addSql('CREATE INDEX IDX_7D053A936F03ABFB ON menu (last_user_edit_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE menu DROP FOREIGN KEY FK_7D053A936F03ABFB');
        $this->addSql('DROP INDEX IDX_7D053A936F03ABFB ON menu');
        $this->addSql('ALTER TABLE menu DROP last_user_edit_id, DROP edited_at');
    }
}
