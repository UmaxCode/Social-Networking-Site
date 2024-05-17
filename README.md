# Social Networking Platform (Java Spring Boot)

This is a social networking platform designed to prioritize user privacy, safety, and provide a positive online environment for users to connect and share content. This document serves as a guide to help you understand the functionalities, setup, and use of our application.

## Features

- User Registration and Email Verification
- Secure Login (Email & Password, Google Authentication, or Facebook Authentication)
- Profile Management
    - Update Profile Picture
    - Reset Password
    - Blacklist Management
- Friend Connections and Management
- Content Sharing (Text, Images, Videos)
- Invitation System
- Online Status Indicator

## User Stories

1. **User Registration**: Users can register by providing their full name, username, email, and password.
2. **Email Verification**: An email verification is sent to confirm the user's email before account activation.
3. **User Login**: Users can log in using their email & password, Google Authentication, or Facebook Authentication.
4. **Profile Management**: Users can manage their profile settings, including updating their profile picture, resetting their password, and managing their blacklist.
5. **Friend Connections**: Users can search for other users, send invitation requests, accept or decline invitations, and manage their contact list.
6. **Content Sharing**: Users can share text, images, and videos with their contacts.
7. **Online Status**: An online status indicator shows whether a contact is currently online.

## Acceptance Criteria

- Registration requires full name, username, email, and password.
    - Password must be at least 8 characters long and include upper and lower case letters, numbers, and special characters.
    - Username and email must be unique.
- Email verification is required before account activation.
- Login requires authentication via email & password, Google Authentication, or Facebook Authentication.
- Profile settings include options to update profile picture, reset password, and manage blacklist.
- Users can search for others by email or username and send invites.
- Invitation requests can be accepted or declined.
- Accepted invitations add both users to each other's contact list.
- Users can share texts, images, and videos which are viewable within the app.
- An online status indicator (green circle) shows next to online contacts' names.

## Installation

### Prerequisites

- 
- 
- 

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/UmaxCode/Social-Networking-Site.git
