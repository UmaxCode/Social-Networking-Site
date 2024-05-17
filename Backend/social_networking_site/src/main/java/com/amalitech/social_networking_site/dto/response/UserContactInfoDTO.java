package com.amalitech.social_networking_site.dto.response;

public record UserContactInfoDTO(String fullname, String email, boolean onlineStatus, String profilePic, boolean blackListed) {
}
