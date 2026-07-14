package com.taskflow.api.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private int todoCount;
    private int inProgressCount;
    private int doneCount;
}