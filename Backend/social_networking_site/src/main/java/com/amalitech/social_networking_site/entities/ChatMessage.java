package com.amalitech.social_networking_site.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class ChatMessage {

    @Id
    @GeneratedValue
    private Integer id;

    private String chatId;

    private String senderEmail;

    private String content;

}
