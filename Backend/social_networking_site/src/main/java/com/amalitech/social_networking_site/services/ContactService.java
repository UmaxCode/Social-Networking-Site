package com.amalitech.social_networking_site.services;


import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.repositories.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserService userService;


    public Optional<Contact> findUserContact(String ownerEmail, String contactEmail){
        return contactRepository.findByOwnerAndEmail(userService.getUserFromEmail(ownerEmail), contactEmail);
    }
}
