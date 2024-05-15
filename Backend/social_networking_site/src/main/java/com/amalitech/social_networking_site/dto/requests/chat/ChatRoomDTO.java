package com.amalitech.social_networking_site.dto.requests.chat;

import com.amalitech.social_networking_site.entities.ChatRoom;

public record ChatRoomDTO(ChatRoom chatRoom, String receiver_profile) {
}
