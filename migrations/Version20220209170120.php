<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220209170120 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE friend (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, accepted TINYINT(1) NOT NULL, requested_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', accepted_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_55EEAC61A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE friend_user (friend_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_17E90AA96A5458E8 (friend_id), INDEX IDX_17E90AA9A76ED395 (user_id), PRIMARY KEY(friend_id, user_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE friend ADD CONSTRAINT FK_55EEAC61A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE friend_user ADD CONSTRAINT FK_17E90AA96A5458E8 FOREIGN KEY (friend_id) REFERENCES friend (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE friend_user ADD CONSTRAINT FK_17E90AA9A76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE friend_user DROP FOREIGN KEY FK_17E90AA96A5458E8');
        $this->addSql('DROP TABLE friend');
        $this->addSql('DROP TABLE friend_user');
    }
}
