package com.amalitech.social_networking_site.dto.response;

import java.util.List;

public record UserDetailsData(UserSummaryInfoDTO info, List<ContactSummaryDTO> contacts) {
}
