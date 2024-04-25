package com.amalitech.social_networking_site.entities;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Entity
public class Invite {

    @Id
    @GeneratedValue
    private Integer id;

    private LocalDateTime time;

    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
