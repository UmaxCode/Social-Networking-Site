package com.amalitech.social_networking_site.listeners;

import com.amalitech.social_networking_site.dto.requests.chat.OnlineUser;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.services.ChatRoomService;
import com.amalitech.social_networking_site.services.UserService;
import com.amalitech.social_networking_site.utilities.Notification;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;


@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageSendingOperations;
    private final UserService userService;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {

        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String email = (String) headerAccessor.getSessionAttributes().get("email");

        if (email != null) {

            var notification = Notification.
                    builder()
                    .message(String.format("%s is offline", email))
                    .build()
                    ;
            userService.setUserOnlineStatus(new OnlineUser(email), false);

            messageSendingOperations.convertAndSend("/user/public", notification);


        }

    }

}
