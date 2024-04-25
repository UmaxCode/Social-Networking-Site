package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.Contact;
import org.springframework.data.repository.CrudRepository;

public interface ContactRepository extends CrudRepository<Contact, Integer> {
}
