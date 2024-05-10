package com.amalitech.social_networking_site.dto.response;

import org.apache.tomcat.util.file.ConfigurationSource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;

import java.net.URL;
import java.util.List;

public record UserDetailsData(UserInfo info, List<ContactDTO> contacts) {
}
