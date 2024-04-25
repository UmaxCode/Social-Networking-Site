package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.Token;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TokenRepository extends CrudRepository<Token, Integer> {

    Optional<Token> findByToken(String token);
}
