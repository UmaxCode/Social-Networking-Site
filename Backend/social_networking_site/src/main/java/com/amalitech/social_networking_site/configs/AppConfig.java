package com.amalitech.social_networking_site.configs;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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


    @Bean
    public Cloudinary getCloudinary() {

        Map<String, String> config = new HashMap<>();

        config.put("cloud_name", cloud_name);
        config.put("api_key", cloud_api_key);
        config.put("api_secret", cloud_secret_key);

        return new Cloudinary(config);

    }

}
