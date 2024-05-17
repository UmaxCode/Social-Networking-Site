package com.amalitech.social_networking_site.controllers.user;

import com.amalitech.social_networking_site.dto.requests.chat.CMessage;
import com.amalitech.social_networking_site.dto.requests.chat.OnlineUser;
import com.amalitech.social_networking_site.dto.response.OnlineStatusUpdateDTO;
import com.amalitech.social_networking_site.dto.response.UserContactInfoDTO;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.services.ChatMessagingService;
import com.amalitech.social_networking_site.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
@Slf4j
@Controller
@RequiredArgsConstructor
public class ChatController {

    private final ChatMessagingService chatMessagingService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;



    @MessageMapping("/chat")
    public void processMessage(
            @Payload CMessage message
    ) {

             var processedMessage = chatMessagingService.save(message);
             messagingTemplate.convertAndSendToUser(message.receiverEmail(), "queue/messages", processedMessage);


    }

    @MessageMapping("/user.online")
    @SendTo("/user/public")
    public OnlineStatusUpdateDTO userOnline(
            @Payload OnlineUser user, SimpMessageHeaderAccessor headerAccessor) {

        headerAccessor.getSessionAttributes().put("email", user.email());

        return userService.setUserOnlineStatus(user, true);

    }

    @MessageMapping("/user.offline")
    @SendTo("/user/public")
    public OnlineStatusUpdateDTO userOffline(@Payload OnlineUser user) {

        return userService.setUserOnlineStatus(user, false);
    }


    @GetMapping("/messages/{senderEmail}/{receiverEmail}")
    public ResponseEntity<List<ChatMessage>> findChatMessages(
            @PathVariable String senderEmail,
            @PathVariable String receiverEmail
    ) {

        return ResponseEntity.ok(chatMessagingService.findChatMessages(senderEmail, receiverEmail));
    }

//    @GetMapping("/chatRooms")
//    public ResponseEntity<?> getUserChatRooms(Authentication authentication) {
//
//        try {
//            User sender = userService.getUserDetails(authentication);
//
//            List<Contact> userContacts = sender.getContacts().stream().filter((contact -> contact.getContactState().equals(Utilities.ContactState.WHITELIST))).toList();
//
//            List<ChatRoomDTO> chatRooms = userContacts.stream().map((contact -> new ChatRoomDTO(chatRoomService.findBySenderEmailAndReceiverEmail(sender.getEmail(), contact.getEmail()), userService.getUserFromEmail(contact.getEmail()).getProfile().getFilePath()))).toList();
//
//            return ResponseEntity.ok(chatRooms);
//
//        } catch (Exception e) {
//            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
//        }
//
//    }


}
