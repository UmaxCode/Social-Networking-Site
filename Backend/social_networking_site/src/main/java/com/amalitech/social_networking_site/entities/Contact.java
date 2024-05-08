package com.amalitech.social_networking_site.entities;


import static com.amalitech.social_networking_site.utilities.Utilities.ContactState;

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
public class Contact {

    @Id
    @GeneratedValue
    private Integer id;

    private String contact;

    @Enumerated(EnumType.STRING)
    private ContactState contactState;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User owner;
}
