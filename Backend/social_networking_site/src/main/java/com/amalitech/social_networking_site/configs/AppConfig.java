package com.amalitech.social_networking_site.configs;

import com.amalitech.social_networking_site.entities.Token;
import com.amalitech.social_networking_site.entities.userDetials.UserDetailsImpl;
import com.amalitech.social_networking_site.repositories.TokenRepository;
import com.amalitech.social_networking_site.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.logout.LogoutHandler;

@Configuration
@RequiredArgsConstructor
public class AppConfig {

    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;


    @Bean
    public PasswordEncoder hashPassword() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setUserDetailsService(userDetailsService());
        daoAuthenticationProvider.setPasswordEncoder(hashPassword());

        return daoAuthenticationProvider;

    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {

        return username -> userRepository.findByEmail(username).map(user -> UserDetailsImpl.builder().email(user.getEmail()).password(user.getPassword()).role(user.getRole()).build()).orElseThrow();

    }

    @Bean
    public LogoutHandler logoutHandler() {
        return (request, response, authentication) -> {

            final String authHeader = request.getHeader("Authorization");
            final String authToken;

            if (authHeader == null || !authHeader.startsWith("Bearer")) {
                return;
            }

            authToken = authHeader.substring(7);

            Token token = tokenRepository.findByToken(authToken).orElseThrow();

            token.setIsRevoked(true);

            tokenRepository.save(token);

        };
    }
}
