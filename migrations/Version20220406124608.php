<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220406124608 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE fields_category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE fields ADD category_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE fields ADD CONSTRAINT FK_7EE5E38812469DE2 FOREIGN KEY (category_id) REFERENCES fields_category (id)');
        $this->addSql('CREATE INDEX IDX_7EE5E38812469DE2 ON fields (category_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE fields DROP FOREIGN KEY FK_7EE5E38812469DE2');
        $this->addSql('DROP TABLE fields_category');
        $this->addSql('DROP INDEX IDX_7EE5E38812469DE2 ON fields');
        $this->addSql('ALTER TABLE fields DROP category_id');
    }
}
