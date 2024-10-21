package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.entities.userDetials.UserDetailsImpl;
import com.amalitech.social_networking_site.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;


    @Cacheable(cacheNames = "users", key = "#username")
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException(username));
        return UserDetailsImpl.builder()
                .user(user)
                .build();
    }
}
