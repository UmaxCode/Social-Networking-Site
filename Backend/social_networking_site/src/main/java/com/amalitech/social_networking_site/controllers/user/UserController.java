package com.amalitech.social_networking_site.controllers.user;


import com.amalitech.social_networking_site.dto.requests.user.InviteAcceptance;
import com.amalitech.social_networking_site.dto.requests.user.InviteRequest;
import com.amalitech.social_networking_site.dto.requests.user.PasswordChangeRequest;
import com.amalitech.social_networking_site.dto.response.ErrorMessage;
import com.amalitech.social_networking_site.dto.response.SuccessMessage;
import com.amalitech.social_networking_site.dto.response.UserDetailsData;
import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.entities.Invite;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    final private UserService userService;

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(Authentication authentication) {
        try {
            var user = userService.getUserDetails(authentication);

            String filePath = user.getProfile().getFilePath();

            //TODO: work on file preview

            return ResponseEntity.ok(new UserDetailsData(user.getFullName(), user.getUsername(), user.getEmail(), user.getRole().name(), filePath));
        } catch (Exception err) {

            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }


    @GetMapping("/contacts")
    public ResponseEntity<?> getUserContacts(Authentication authentication) {

        try {
            List<Contact> userContacts = userService.getUserDetails(authentication).getContacts();

            var users = userContacts.stream().map((contact -> userService.getUserFromEmail(contact.getContact()))).toList();


            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage("Error occurred will loading users contacts"));
        }

    }


    @PutMapping("/change_password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest userData) {

        try {
            String message = userService.changeUserPassword(userData);
            return ResponseEntity.ok(new SuccessMessage(message));
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }

    @PutMapping("/profile_pic_update")
    public ResponseEntity<?> updateProfilePic(@RequestBody MultipartFile file) {
        try {
            String message = userService.changeUserProfilePic(file);
            return ResponseEntity.ok(new SuccessMessage(message));
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }


    @PostMapping("/send_invite")
    public ResponseEntity<?> sendInvite(@RequestBody InviteRequest invite, Authentication authentication) {

        try {

            User sender = userService.getUserDetails(authentication);

            User receiver = userService.getUserFromEmail(invite.email());

            userService.sendUserInvite(sender, receiver);
            return ResponseEntity.ok(new SuccessMessage(String.format("Invite sent to %s successfully", invite.email())));
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }

    }

    @GetMapping("/invites")
    public ResponseEntity<?> findListOfUserInvites(Authentication authentication) {

        try {

            String email = userService.getUserDetails(authentication).getEmail();
            List<Invite> userInvite = userService.loadingPendingInvite(email);

            return ResponseEntity.ok(userInvite);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }

    }


    @PostMapping("/accept_invite")
    public ResponseEntity<?> acceptInvite(@RequestBody InviteAcceptance inviteAcceptance, Authentication authentication) {
        try {

            String senderEmail = userService.getUserDetails(authentication).getEmail();
            userService.acceptUserInvite(inviteAcceptance.id(), senderEmail);
            return ResponseEntity.ok(new SuccessMessage("Invite accepted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }
    }
}
