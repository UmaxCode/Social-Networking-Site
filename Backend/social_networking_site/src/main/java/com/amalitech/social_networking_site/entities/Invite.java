package com.amalitech.social_networking_site.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Invite {

    @Id
    @GeneratedValue
    private Integer id;

    private String receiver;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User sender;
}
