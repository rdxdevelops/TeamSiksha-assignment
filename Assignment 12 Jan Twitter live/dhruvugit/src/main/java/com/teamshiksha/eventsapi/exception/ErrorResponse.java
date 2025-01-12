package com.teamshiksha.eventsapi.exception;

import lombok.AllArgsConstructor;
import lombok.Data;

public final class ErrorResponse {

    private final int status;
    private final String message;

    public ErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        throw new UnsupportedOperationException("status cannot be modified");
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        throw new UnsupportedOperationException("message cannot be modified");
    }

    @Override
    public String toString() {
        return "ErrorResponse{" +
                "status=" + status +
                ", message='" + message + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        ErrorResponse that = (ErrorResponse) obj;
        return status == that.status && message.equals(that.message);
    }

    @Override
    public int hashCode() {
        int result = Integer.hashCode(status);
        result = 31 * result + message.hashCode();
        return result;
    }
}
