package com.amalitech.social_networking_site.dto.response;

import com.amalitech.social_networking_site.entities.User;

public record ContactResponseDTO(User user, boolean contactStatus) {
}
