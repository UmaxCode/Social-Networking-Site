package com.amalitech.social_networking_site.dto.response;

import com.amalitech.social_networking_site.entities.Invite;
import com.amalitech.social_networking_site.entities.User;

import java.util.List;

public record Invitations(List<String> nonInviteUsers, List<InviteDTO> invites) {
}
