package com.amalitech.social_networking_site.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.List;

import static com.amalitech.social_networking_site.utilities.Utilities.Role;


@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
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

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(mappedBy = "user")
    @JsonManagedReference
    @Cascade(CascadeType.ALL)
    private UserProfile profile;

    private Boolean isActive;

    @OneToMany(mappedBy = "owner")
    @JsonManagedReference
    @Cascade(CascadeType.ALL)
    private List<Contact> contacts;

    @OneToMany(mappedBy = "sender")
    @JsonManagedReference
    @Cascade(CascadeType.ALL)
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
