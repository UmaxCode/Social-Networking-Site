package com.amalitech.social_networking_site.dto.requests.user;

public record PasswordChangeRequest(String oldPassword, String newPassword) {
}
