package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.Invite;
import com.amalitech.social_networking_site.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InviteRepository extends JpaRepository<Invite, Integer> {

    List<Invite> findByReceiver(String receiver);

}
