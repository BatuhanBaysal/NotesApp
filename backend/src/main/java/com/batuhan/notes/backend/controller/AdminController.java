package com.batuhan.notes.backend.controller;

import com.batuhan.notes.backend.dto.RoleUpdateRequest;
import com.batuhan.notes.backend.entity.UserEntity;
import com.batuhan.notes.backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<String> updateUserRole(@PathVariable Long userId, @RequestBody RoleUpdateRequest request) {
        adminService.updateUserRole(userId, request);
        return ResponseEntity.ok("User role updated successfully.");
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully.");
    }
}