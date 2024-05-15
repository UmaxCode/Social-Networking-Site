package com.amalitech.social_networking_site.dto.response;

public record UserAuthenticationResponse(String message, String token, String username, String profile_pic) {
}
