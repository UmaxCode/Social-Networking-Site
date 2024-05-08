package com.amalitech.social_networking_site.controllers.user;

import com.amalitech.social_networking_site.dto.requests.chat.CMessage;
import com.amalitech.social_networking_site.dto.requests.chat.OnlineUser;
import com.amalitech.social_networking_site.dto.response.ErrorMessage;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.entities.ChatRoom;
import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.services.ChatMessagingService;
import com.amalitech.social_networking_site.services.ChatRoomService;
import com.amalitech.social_networking_site.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessagingService chatMessagingService;
    private final ChatRoomService chatRoomService;
    private final UserService userService;


    @MessageMapping("/chat")
    public void processMessage(
            @Payload CMessage message
    ) {

        chatMessagingService.save(message);
    }

    @MessageMapping("/user.online")
    @SendTo("/user/public")
    public ChatRoom userOnline(
            @Payload OnlineUser user) {

        return chatRoomService.setChatRoomState(user, true);

    }

    @MessageMapping("/user.offline")
    @SendTo("/user/public")
    public ChatRoom userOffline(@Payload OnlineUser user) {

        return chatRoomService.setChatRoomState(user, false);

    }


    @GetMapping("/messages/{senderEmail}/{receiverEmail}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {

        return ResponseEntity.ok(chatMessagingService.findChatMessages(senderEmail, receiverEmail));
    }

    @GetMapping("/chatRooms")
    public ResponseEntity<?> getUserChatRooms(Authentication authentication) {

        try {
            List<Contact> userContacts = userService.getUserDetails(authentication).getContacts();

            var users = userContacts.stream().map((contact -> chatRoomService.findChatRoomByReceiver(contact.getContact()))).toList();

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }

    }


}