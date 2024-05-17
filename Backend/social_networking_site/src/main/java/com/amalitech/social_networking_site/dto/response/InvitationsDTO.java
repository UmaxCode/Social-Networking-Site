package com.amalitech.social_networking_site.dto.response;

import java.util.List;

public record InvitationsDTO(List<String> nonInviteUsers, List<InviteDTO> invites) {
}
