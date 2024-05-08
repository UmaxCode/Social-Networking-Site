package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.chat.OnlineUser;
import com.amalitech.social_networking_site.entities.ChatRoom;
import com.amalitech.social_networking_site.repositories.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;


    public String getChatRoomId(String senderEmail, String receiverEmail){

        var chatIdOptional = chatRoomRepository.findBySenderEmailAndReceiverEmail(senderEmail, receiverEmail)
                .map(ChatRoom::getChatId);

        return chatIdOptional.orElse(null);

    }

    public void createChatId(String senderEmail, String receiverEmail){

        var chatId =  String.format("%s_%s", senderEmail, receiverEmail);

        ChatRoom senderReceiver = ChatRoom.builder()
                .chatId(chatId)
                .senderEmail(senderEmail)
                .online(false)
                .receiverEmail(receiverEmail)
                .build();

        ChatRoom receiverSender = ChatRoom.builder()
                .chatId(chatId)
                .senderEmail(receiverEmail)
                .online(false)
                .receiverEmail(senderEmail)
                .build();

        chatRoomRepository.save(senderReceiver);
        chatRoomRepository.save(receiverSender);


    }


    public ChatRoom setChatRoomState(OnlineUser onlineUser, boolean value) {

        Optional<ChatRoom> optionalChatRoom = chatRoomRepository.findBySenderEmail(onlineUser.email());

        if(optionalChatRoom.isEmpty()){
            return null;
        }

        var chatRoom = optionalChatRoom.get();

        chatRoom.setOnline(value);

       return chatRoomRepository.save(chatRoom);

    }

    public ChatRoom findChatRoomByReceiver(String receiverEmail){

        return chatRoomRepository.findByReceiverEmail(receiverEmail);

    }

}
