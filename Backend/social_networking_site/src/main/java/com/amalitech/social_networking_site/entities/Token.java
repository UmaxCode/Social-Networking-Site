package com.amalitech.social_networking_site.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Token {

    @Id
    @GeneratedValue
    private Integer id;

    private String token;

    private Boolean isRevoked;

    private Boolean isExpired;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Override
    public String toString() {
        return "Token{" +
                "token='" + token + '\'' +
                ", isRevoked='" + isRevoked + '\'' +
                ", isExpired='" + isExpired + '\''
                ;
    }
}
