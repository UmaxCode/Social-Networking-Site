package com.amalitech.social_networking_site.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

@Entity
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserProfile {

    @Id
    @GeneratedValue
    private Integer id;

    private String filePath;

    private Boolean onlineStatus;

    @OneToOne
    @JsonBackReference
    @JoinColumn(name = "user_id")
    private User user;
}
