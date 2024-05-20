const baseURL = "https://umaxconnect.onrender.com/";
// const baseURL = "http://localhost:8080/";

const backendEndpoints = {
  websocket_url: "ws://umaxconnect.onrender.com/ws",
  register: `${baseURL}auth/register`,
  login: `${baseURL}auth/authenticate`,
  forgot_password: `${baseURL}auth/password_reset`,
  google_oauth: `${baseURL}auth/oauth_google_callback?code=`,
  invite_listing: `${baseURL}user/list/invitation`,
  send_invite: `${baseURL}user/send_invite`,
  accept_invite: `${baseURL}user/accept_invite`,
  decline_invite: `${baseURL}user/decline_invite`,
  load_messages: `${baseURL}messages/`,
  load_UserDetails: `${baseURL}user/details`,
  update_profile: `${baseURL}user/profile_pic_update`,
  change_password: `${baseURL}user/change_password`,
  change_contactStatus: `${baseURL}user/blacklist-whitelist`,
  user_contacts: `${baseURL}user/contacts`,
};

export default backendEndpoints;
