<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220512164110 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE forum_category (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE forum_topic (id INT AUTO_INCREMENT NOT NULL, category_id INT NOT NULL, owner_id INT NOT NULL, title VARCHAR(255) NOT NULL, content LONGTEXT NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', resolved TINYINT(1) NOT NULL, INDEX IDX_853478CC12469DE2 (category_id), INDEX IDX_853478CC7E3C61F9 (owner_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE forum_topic ADD CONSTRAINT FK_853478CC12469DE2 FOREIGN KEY (category_id) REFERENCES forum_category (id)');
        $this->addSql('ALTER TABLE forum_topic ADD CONSTRAINT FK_853478CC7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE forum_topic DROP FOREIGN KEY FK_853478CC12469DE2');
        $this->addSql('DROP TABLE forum_category');
        $this->addSql('DROP TABLE forum_topic');
    }
}
