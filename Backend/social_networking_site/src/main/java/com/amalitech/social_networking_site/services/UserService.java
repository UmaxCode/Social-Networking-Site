package com.amalitech.social_networking_site.services;

import com.amalitech.social_networking_site.dto.requests.chat.OnlineUser;
import com.amalitech.social_networking_site.dto.requests.user.ContactStatusDTO;
import com.amalitech.social_networking_site.dto.requests.user.PasswordChangeRequest;
import com.amalitech.social_networking_site.dto.response.InviteDTO;
import com.amalitech.social_networking_site.dto.response.OnlineStatusUpdateDTO;
import com.amalitech.social_networking_site.dto.response.UserContactInfoDTO;
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

import java.io.IOException;
import java.security.GeneralSecurityException;
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
    final private CloudinaryService cloudinaryService;

    @Value("${upload.profile.directory}")
    private String upload_profile_directory;

    public User getUserDetails(Authentication authentication) {

        var principal = (UserDetails) authentication.getPrincipal();

        return getUserFromEmail(principal.getUsername());

    }

    public List<User> getAllPlatformUsers() {

        return userRepository.findAll();
    }

    public User getUserFromEmail(String email) {

        Optional<User> optionalUser = userRepository.findByEmail(email);

        if (optionalUser.isPresent()) return optionalUser.get();

        throw new IllegalArgumentException("User does not exits");
    }


    public String changeUserProfilePic(MultipartFile file) throws IOException, GeneralSecurityException {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        try {
            String imageUrl = cloudinaryService.uploadFile(file).get("url").toString();

            User user = userRepository.findByEmail(email).orElseThrow();

            user.getProfile().setFilePath(imageUrl);

            userRepository.save(user);

            return user.getProfile().getFilePath();
        }catch (Exception e){
            throw new IllegalArgumentException("Error occurred while uploading image.");
        }

    }

    public String changeUserPassword(PasswordChangeRequest userData) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email).orElseThrow();

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("Please go to forget password page to request for a password");
        }

        if (passwordEncoder.matches(userData.oldPassword(), user.getPassword())) {
            user.setPassword(passwordEncoder.encode(userData.newPassword()));
            userRepository.save(user);

            return "Password changed successfully!";
        }

        throw new IllegalArgumentException("Incorrect password");
    }


    public void sendUserInvite(User sender, User receiver) {


        Optional<Invite> senderToReceiver = inviteRepository.findBySenderAndReceiver(sender, receiver.getEmail());

        if (senderToReceiver.isPresent()) {
            throw new IllegalArgumentException(String.format("You have already sent and invite to %s", receiver.getEmail()));
        }

        Optional<Invite> receiverToSender = inviteRepository.findBySenderAndReceiver(receiver, sender.getEmail());

        if (receiverToSender.isPresent()) {
            throw new IllegalArgumentException(String.format("%s has already sent you an invite.", receiver.getEmail()));

        }


        Optional<Contact> optionalContact = contactRepository.findByOwnerAndEmail(sender, receiver.getEmail());

        if (optionalContact.isPresent()) {

            throw new IllegalArgumentException(String.format("You and %s are friends. Refresh to see current update", receiver.getEmail()));
        }


        Invite userInvite = Invite.builder()
                .receiver(receiver.getEmail())
                .sender(sender)
                .build();

        inviteRepository.save(userInvite);
    }

        public OnlineStatusUpdateDTO setUserOnlineStatus(OnlineUser onlineUser, boolean value) {

            User user = getUserFromEmail(onlineUser.email());

            user.getProfile().setOnlineStatus(value);

            userRepository.save(user);

            return new OnlineStatusUpdateDTO(user.getFullName(), user.getEmail(), user.getProfile().getOnlineStatus(), user.getProfile().getFilePath());

    }

    public String acceptUserInvite(String senderEmail, String receiverEmail) {

        Optional<User> optionalUser = userRepository.findByEmail(senderEmail);

        if (optionalUser.isEmpty()) {

            throw new IllegalArgumentException("Invite sender not found.");
        }

        User sender = optionalUser.get();
        Optional<Invite> optionalInvite = inviteRepository.findBySenderAndReceiver(sender, receiverEmail);

        if (optionalInvite.isEmpty()) {
            throw new IllegalArgumentException(String.format("%s is not in your invite list. Refresh to see current update", senderEmail));
        }

        var invite = optionalInvite.get();

        User receiver = getUserFromEmail(invite.getReceiver());


        Contact senderContact = Contact.builder()
                .fullname(getUserFromEmail(invite.getReceiver()).getFullName())
                .email(invite.getReceiver())
                .contactState(Utilities.ContactState.WHITELIST)
                .owner(invite.getSender())
                .build();

        Contact receiverContact = Contact.builder()
                .fullname(getUserFromEmail(invite.getSender().getEmail()).getFullName())
                .email(invite.getSender().getEmail())
                .contactState(Utilities.ContactState.WHITELIST)
                .owner(getUserFromEmail(
                        invite.getReceiver()
                ))
                .build();



        chatRoomService.createChatId(senderContact.getOwner().getEmail(), receiverContact.getOwner().getEmail());


        contactRepository.save(senderContact);

        contactRepository.save(receiverContact);

        inviteRepository.delete(invite);

        return "Invite accepted successfully";

    }

    public String declineInvite(String senderEmail, String receiverEmail) {

        Optional<User> optionalUser = userRepository.findByEmail(senderEmail);

        if (optionalUser.isEmpty()) {

            throw new IllegalArgumentException("Invite sender not found.");
        }

        User sender = optionalUser.get();

        Optional<Invite> optionalInvite = inviteRepository.findBySenderAndReceiver(sender, receiverEmail);

        if (optionalInvite.isEmpty()) {
            throw new IllegalArgumentException("Invite does not exist");
        }

        inviteRepository.delete(optionalInvite.get());

        return String.format("You declined an invite from %s", senderEmail);

    }


    public String setUserContactStatus(ContactStatusDTO contactStatusDTO, User owner) {


        User userContact = getUserFromEmail(contactStatusDTO.contact());
        Optional<Contact> optionalContact = contactRepository.findByOwnerAndEmail(owner, userContact.getEmail());

        if (optionalContact.isEmpty()) {
            throw new IllegalArgumentException("Contact does not exist");
        }

        Contact contact = optionalContact.get();

        if (contactStatusDTO.status().equals("BLACKLIST")) {
            contact.setContactState(Utilities.ContactState.WHITELIST);
        } else {
            contact.setContactState(Utilities.ContactState.BLACKLIST);

        }

        contactRepository.save(contact);

        return String.format("%s is added to %s", contact.getFullname(), contact.getContactState().name());

    }


    public List<InviteDTO> loadingPendingInvite(String receiver) {

        return inviteRepository.findByReceiver(receiver).stream().map((invite -> new InviteDTO(findInviteSenderEmail(invite.getSender()), invite.getId()))).toList();

    }

    private String findInviteSenderEmail(User inviteSender) {

        var optionalUser = userRepository.findById(inviteSender.getId());

        return optionalUser.map(User::getEmail).orElse(null);
    }

}


