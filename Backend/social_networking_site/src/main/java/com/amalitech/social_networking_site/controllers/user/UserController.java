package com.amalitech.social_networking_site.controllers.user;


import com.amalitech.social_networking_site.dto.requests.user.ContactStatusDTO;
import com.amalitech.social_networking_site.dto.requests.user.InviteDTO;
import com.amalitech.social_networking_site.dto.requests.user.InviteRequest;
import com.amalitech.social_networking_site.dto.requests.user.PasswordChangeRequest;
import com.amalitech.social_networking_site.dto.response.*;
import com.amalitech.social_networking_site.entities.Contact;
import com.amalitech.social_networking_site.entities.User;
import com.amalitech.social_networking_site.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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

            List<ContactDTO> contacts = user.getContacts().stream().map((contact -> new ContactDTO(contact.getFullname(), contact.getEmail(), contact.getContactState().name()))).toList();

            return ResponseEntity.ok(new UserDetailsData(new UserInfo(user.getFullName(), user.getUsername(), user.getEmail(), user.getRole().name(), filePath), contacts));
        } catch (Exception err) {

            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }


    @GetMapping("/contacts")
    public ResponseEntity<?> getUserContacts(Authentication authentication) {

        try {
            List<Contact> userContacts = userService.getUserDetails(authentication).getContacts();

            var users = userContacts.stream().map((contact -> userService.getUserFromEmail(contact.getEmail()))).toList();


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
    public ResponseEntity<?> updateProfilePic(@RequestParam("file") MultipartFile file) {
        try {
            String message = userService.changeUserProfilePic(file);
            return ResponseEntity.ok(new SuccessMessage(message));
        } catch (Exception err) {
            return ResponseEntity.status(400).body(new ErrorMessage(err.getMessage()));
        }
    }

    @PutMapping("/blacklist-whitelist")
    public ResponseEntity<?> updateContactStatus(@RequestBody ContactStatusDTO statusDTO, Authentication authentication){

        User user = userService.getUserDetails(authentication);
        try {
              String message = userService.setUserContactStatus(statusDTO, user);
              return ResponseEntity.ok(new SuccessMessage(message));
        }catch (Exception err){
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
            List<com.amalitech.social_networking_site.dto.response.InviteDTO> userInvite = userService.loadingPendingInvite(email);

            return ResponseEntity.ok(userInvite);

        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }

    }

    @GetMapping("/list/invitation")
    public ResponseEntity<?> getInviteUsersAndNonInviteUsers(Authentication authentication){

        try {
            String email = userService.getUserDetails(authentication).getEmail();
            List<com.amalitech.social_networking_site.dto.response.InviteDTO> invites = userService.loadingPendingInvite(email);

            List<String> userContacts = userService.getUserDetails(authentication).getContacts().stream().map((Contact::getEmail)).toList();

            List<String> availableUsers = userService.getAllPlatformUsers().stream().map((User::getEmail)).filter((user)-> !userContacts.contains(user) && !user.equals(email)).toList();

            return ResponseEntity.ok(new Invitations(availableUsers, invites));
        }catch (Exception e){
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }
    }


    @PostMapping("/accept_invite")
    public ResponseEntity<?> acceptInvite(@RequestBody InviteDTO inviteDTO, Authentication authentication) {
        try {
            String receiverEmail = userService.getUserDetails(authentication).getEmail();
            String message = userService.acceptUserInvite(inviteDTO.email(), receiverEmail);
            return ResponseEntity.ok(new SuccessMessage(message));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }
    }

    @DeleteMapping("/decline_invite")
    public ResponseEntity<?> declineInvite(@RequestBody InviteDTO inviteDTO, Authentication authentication){
        try {
            String receiverEmail = userService.getUserDetails(authentication).getEmail();
            String message = userService.declineInvite(inviteDTO.email(), receiverEmail);
            return ResponseEntity.ok(new SuccessMessage(message));
        }catch(Exception e){
            return ResponseEntity.status(400).body(new ErrorMessage(e.getMessage()));
        }
    }
}
