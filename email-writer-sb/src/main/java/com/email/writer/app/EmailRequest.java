package com.email.writer.app;

public class EmailRequest {

    private String emailcontent;
    private String tone;

    public String getTone() {
        return tone != null ? tone : "professional";
    }

    public void setTone(String tone) {
        this.tone = tone;
    }

    public String getEmailcontent() {
        return emailcontent;
    }

    public void setEmailcontent(String emailcontent) {
        this.emailcontent = emailcontent;
    }

    public boolean isValid() {
        return emailcontent != null && !emailcontent.trim().isEmpty();
    }
}