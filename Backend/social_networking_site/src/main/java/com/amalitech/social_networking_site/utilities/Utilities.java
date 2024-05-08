package com.amalitech.social_networking_site.utilities;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Locale;

public class Utilities {

    public enum Role {

        REG_USER,
        ADMIN_USER
    }

    public enum TokenSubject{

        EMAIL_VERIFICATION,
        LOGIN
    }

   public enum ContactState {
        BLACKLIST,

        WHITELIST
    }

    static private String getRandomChars(String text, int size){

        SecureRandom secureRandom = new SecureRandom();

        StringBuilder stringBuilder = new StringBuilder();

        for(int i=0; i < size; i++){
            int randNum = secureRandom.nextInt(text.length());
             stringBuilder.append(text.charAt(randNum));
        }

        return stringBuilder.toString();
    }

    static private List<String> generatePasswordList(){
        final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        final String LOWERCASE = UPPERCASE.toLowerCase(Locale.ROOT);
        final String NUMBERS = "0123456789";
        final String SPECIAL_CHARACTERS = "!@#$%^&*()_+";

        String pwString = getRandomChars(UPPERCASE, 2).concat(getRandomChars(LOWERCASE, 2)).concat(getRandomChars(NUMBERS, 2)).concat(getRandomChars(SPECIAL_CHARACTERS, 2));

        List<String> pwChars = new ArrayList<>(List.of(pwString));
        Collections.shuffle(pwChars);

        return pwChars;

    }
    static public String generatePassword(){

       return String.join("", generatePasswordList());
    }

}
