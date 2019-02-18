<?php
namespace App\Entity\Base\Directory;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Table(name="directory_group")
 * @ORM\Entity
 */
abstract class DirectoryGroup extends DirectoryObject {

    /**
     * @var Collection
     * @ORM\ManyToMany(targetEntity="DirectoryObject", mappedBy="groups")
     */
    private $member;

    public function __construct() {
        parent::__construct();
        $this->member = new ArrayCollection();
    }

    /**
     * @return Collection
     */
    public function getMember(): Collection {
        return $this->member;
    }

    public function getEffectiveMembers($rtn = []): Collection {
        foreach ($this->getMember() as $member) {
            if (!in_array($member, $rtn)) {
                $rtn[] = $member;
            }
            if ($member instanceof DirectoryGroup && !$member->getMember()->isEmpty()) {
                $rtn = $member->getEffectiveMembers($rtn)->toArray();
            }
        }
        return new ArrayCollection($rtn);
    }

}