package com.amalitech.social_networking_site.services;


import com.amalitech.social_networking_site.dto.requests.chat.CMessage;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessagingService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;



    public ChatMessage save(CMessage message){

        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(message.chatId())
                .senderEmail(message.senderEmail())
                .content(message.content())
                .build();


        return chatMessageRepository.save(chatMessage);
    }


    public List<ChatMessage> findChatMessages(String senderEmail, String receiverEmail){

        String chatId = chatRoomService.getChatRoomId(senderEmail, receiverEmail);


        return chatMessageRepository.findByChatId(chatId);

    }

}
