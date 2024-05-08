package com.amalitech.social_networking_site.dto.response;

import org.apache.tomcat.util.file.ConfigurationSource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.net.URL;

public record UserDetailsData(String fullname, String username, String email, String role, String path) {
}
