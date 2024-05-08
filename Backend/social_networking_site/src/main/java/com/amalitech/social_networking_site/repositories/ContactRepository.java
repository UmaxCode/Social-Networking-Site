package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactRepository extends JpaRepository<Contact, Integer> {

    List<Contact> findByOwner(User owner);
}
