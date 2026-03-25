package com.hms.user.dto;


import com.hms.user.entity.User;
import com.hms.user.validation.EnumValue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    @NotBlank(message = "Name is mandatory")
    private String name;
    @NotBlank(message = "Email is mandatory")
    @Email(message ="Email should be valid")
    private String email;
    @NotBlank(message = "Password is mandatory")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,15}$",
            message = "Password should contain at least 1 uppercase, 1 lowercase, 1 digit and 1 special character min 8 char and max 15 characters")
    private String password;
    private Roles role;

    public User toEntity(){
        return new User(this.id, this.name, this.email, this.password, this.role);
    }
}
