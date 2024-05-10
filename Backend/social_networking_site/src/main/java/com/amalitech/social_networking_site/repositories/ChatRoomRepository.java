package com.amalitech.social_networking_site.repositories;

import com.amalitech.social_networking_site.entities.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Integer> {

    Optional<ChatRoom> findBySenderEmailAndReceiverEmail(String senderEmail, String receiverEmail);

    List<ChatRoom> findBySenderEmail(String senderEmail);

    List<ChatRoom> findByReceiverEmail(String senderEmail);


}
