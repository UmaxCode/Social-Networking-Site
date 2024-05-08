package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.user.PasswordChangeRequest;
import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.entities.Invite;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.repositories.ContactRepository;
import com.amalitech.social_networking_site.repositories.InviteRepository;
import com.amalitech.social_networking_site.repositories.UserRepository;
import com.amalitech.social_networking_site.utilities.Utilities;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    final private UserRepository userRepository;
    final private PasswordEncoder passwordEncoder;
    final private InviteRepository inviteRepository;
    final private ContactRepository contactRepository;
    final private ChatRoomService chatRoomService;

    @Value("${upload.directory}")
    private String upload_directory;

    public User getUserDetails(Authentication authentication) {

        var principal = (UserDetails) authentication.getPrincipal();

        Optional<User> user = userRepository.findByEmail(principal.getUsername());
        return user.orElseThrow(() -> new IllegalArgumentException("DFDF"));

    }

    public User getUserFromEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) return optionalUser.get();

        throw new IllegalArgumentException("User does not exits");
    }


    public String changeUserProfilePic(MultipartFile file) {


        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        String proPicPath = String.format("%s\\%s", upload_directory, user.getUsername() + ".png");

        File pic = new File(proPicPath);
        if (user.getProfile().getFilePath() != null) {

            user.getProfile().setFilePath(null);

            userRepository.save(user);

            pic.delete();
        }

        user.getProfile().setFilePath(pic.getPath());
        userRepository.save(user);

        try {
            file.transferTo(pic);
        } catch (IOException e) {
            throw new IllegalArgumentException(e);
        }

        return String.format("Profile picture updated successfully : %s", file.getOriginalFilename());

    }

    public String changeUserPassword(PasswordChangeRequest userData) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        if (passwordEncoder.matches(userData.oldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(userData.newPassword()));
            userRepository.save(user);

            return "Password changed successfully!";
        }

        throw new IllegalArgumentException("Incorrect password");
    }


    public void sendUserInvite(User sender, User receiver) {


        Invite userInvite = Invite.builder()
                .receiver(receiver.getEmail())
                .sender(sender)
                .build();

        inviteRepository.save(userInvite);
    }

    public void acceptUserInvite(Integer id, String senderEmail) {

        Optional<Invite> optionalInvite = inviteRepository.findById(id);

        if (optionalInvite.isEmpty()) {
            return;
        }

        var invite = optionalInvite.get();

        Contact senderContact = Contact.builder()
                .contact(invite.getReceiver())
                .contactState(Utilities.ContactState.WHITELIST)
                .owner(invite.getSender())
                .build();

        Contact receiverContact = Contact.builder()
                .contact(invite.getSender().getEmail())
                .contactState(Utilities.ContactState.WHITELIST)
                .owner(getUserFromEmail(
                        invite.getReceiver()
                ))
                .build();


        chatRoomService.createChatId(senderContact.getOwner().getEmail(), receiverContact.getOwner().getEmail());


        contactRepository.save(senderContact);

        contactRepository.save(receiverContact);

        inviteRepository.delete(invite);

    }


    public List<Invite> loadingPendingInvite(String receiver) {

        return inviteRepository.findByReceiver(receiver);

    }

}


