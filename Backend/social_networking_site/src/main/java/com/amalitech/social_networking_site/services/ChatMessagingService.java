package com.amalitech.social_networking_site.services;


import com.amalitech.social_networking_site.dto.requests.chat.CMessage;
import com.amalitech.social_networking_site.entities.ChatMessage;
import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.repositories.ChatMessageRepository;
import com.amalitech.social_networking_site.repositories.ContactRepository;
import com.amalitech.social_networking_site.utilities.Utilities;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatMessagingService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final ContactService contactService;



    public ChatMessage save(CMessage message){

        Optional<Contact> senderContactOptional = contactService.findUserContact(message.senderEmail(), message.receiverEmail());
        if(senderContactOptional.isEmpty()){
            throw new IllegalArgumentException("No contact");
        }

        Contact senderContact = senderContactOptional.get();

        if(senderContact.getContactState() == Utilities.ContactState.BLACKLIST){
            throw new IllegalArgumentException("You can't send message to a black listed user");
        }

        Optional<Contact> receiverContactOptional = contactService.findUserContact(message.receiverEmail(), message.senderEmail());
        if(receiverContactOptional.isEmpty()){
            throw new IllegalArgumentException("No contact");
        }

        Contact receiverContact = receiverContactOptional.get();

        if(receiverContact.getContactState() == Utilities.ContactState.BLACKLIST){
            throw new IllegalArgumentException("You have been blacklisted. Message can't be sent");
        }

        String chatId =  chatRoomService.getChatRoomId(message.senderEmail(), message.receiverEmail());

        ChatMessage chatMessage = ChatMessage.builder()
                .chatId(chatId)
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
