package com.amalitech.social_networking_site;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class SocialNetworkingSiteApplication {

    public static void main(String[] args) {
        SpringApplication.run(SocialNetworkingSiteApplication.class, args);
    }

}
