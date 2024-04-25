package com.amalitech.social_networking_site.dto.requests.auth;

public record UserCreationRequest(String fullname, String username, String email, String password, String conPassword) {
}
