package com.amalitech.social_networking_site.dto.requests.chat;

public record CMessage(String senderEmail, String receiverEmail, String content) {
}
