package com.amalitech.social_networking_site;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication()
public class SocialNetworkingSiteApplication {

	public static void main(String[] args) {

		Dotenv.configure().load();

		SpringApplication.run(SocialNetworkingSiteApplication.class, args);
	}

}
