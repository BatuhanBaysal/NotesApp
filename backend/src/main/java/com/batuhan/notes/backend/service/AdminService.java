package com.batuhan.notes.backend.service;

import com.batuhan.notes.backend.dto.RoleUpdateRequest;
import com.batuhan.notes.backend.exception.InvalidInputException;
import com.batuhan.notes.backend.exception.ResourceNotFoundException;
import com.batuhan.notes.backend.user.Role;
import com.batuhan.notes.backend.entity.UserEntity;
import com.batuhan.notes.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateUserRole(Long userId, RoleUpdateRequest request) {
        UserEntity userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Role newRole;
        try {
            newRole = Role.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new InvalidInputException("Invalid role specified: " + request.getRole());
        }

        userToUpdate.setRole(newRole);
        userRepository.save(userToUpdate);
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with ID: " + userId);
        }
        userRepository.deleteById(userId);
    }
}