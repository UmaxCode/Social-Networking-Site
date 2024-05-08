package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface ProfileRepository extends JpaRepository<UserProfile, Integer> {


}
