package com.amalitech.social_networking_site.configs;

import com.amalitech.social_networking_site.entities.userDetials.UserDetailsImpl;
import com.amalitech.social_networking_site.repositories.UserRepository;
import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@Configuration
@RequiredArgsConstructor
public class AppConfig {


    @Value("${cloudinary.name}")
    private String cloud_name;

    @Value("${cloudinary.key}")
    private String cloud_api_key;

    @Value("${cloudinary.secretKey}")
    private String cloud_secret_key;


    private final UserRepository userRepository;


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

        return username -> userRepository.findByEmail(username).map(user -> UserDetailsImpl.builder().email(user.getEmail()).password(user.getPassword()).role(user.getRole()).build()).orElseThrow(()-> new IllegalArgumentException("User does not exit"));

    }

    @Bean
    public Cloudinary getCloudinary(){

        Map<String, String> config = new HashMap<>();

        config.put("cloud_name", cloud_name);
        config.put("api_key", cloud_api_key);
        config.put("api_secret", cloud_secret_key);

        return new Cloudinary(config);




    }

}
