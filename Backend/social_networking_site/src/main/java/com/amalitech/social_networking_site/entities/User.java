package com.amalitech.social_networking_site.entities;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "_user")
public class User {

    @Id
    @GeneratedValue
    private Integer id;

    private String fullName;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    private String password;

    @OneToMany(mappedBy = "user")
    private List<Contact> contacts;

    @OneToOne(mappedBy = "user")
    private Token token;

    @Enumerated(EnumType.STRING)
    private Role role;

    private Boolean isActive;

    @OneToMany(mappedBy = "user")
    private List<Invite> invites;

    @Override
    public String toString() {
        return "User{" +
                "fullname='" + fullName + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
    }


}