package com.amalitech.social_networking_site.services;


import com.amalitech.social_networking_site.dto.requests.chat.CMessage;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessagingService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final SimpMessagingTemplate simpMessagingTemplate;



    public void save(CMessage message){

        String chatId = chatRoomService.getChatRoomId(message.senderEmail(), message.receiverEmail());


        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(chatId)
                .content(message.content())
                .build();



        chatMessageRepository.save(chatMessage);

       simpMessagingTemplate.convertAndSendToUser(message.senderEmail(), "/queue/messages", message);
    }


    public List<ChatMessage> findChatMessages(String senderEmail, String receiverEmail){

        String chatId = chatRoomService.getChatRoomId(senderEmail, receiverEmail);


        return chatMessageRepository.findByChatId(chatId);

    }

}
