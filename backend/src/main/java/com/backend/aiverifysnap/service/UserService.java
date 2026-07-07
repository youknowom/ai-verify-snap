package com.backend.aiverifysnap.service;

import com.backend.aiverifysnap.config.EntityNotFoundException;
import com.backend.aiverifysnap.dto.UserDto;
import com.backend.aiverifysnap.model.Users;
import com.backend.aiverifysnap.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserDto getUserByName(String name) {
        Users user = userRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("User not found with name: " + name));
        return convertToDto(user);
    }

    public UserDto registerUser(String name, String email, String role) {
        Users user = new Users();
        user.setName(name);
        user.setEmail(email);
        user.setRole(role != null ? role : "USER");
        Users saved = userRepository.save(user);
        return convertToDto(saved);
    }

    @Transactional
    public UserDto updateUser(String name, Users user) {
        Users existingUser = userRepository.findByName(name)
                .orElseThrow(() -> new EntityNotFoundException("User not found with name: " + name));
        if ((user.getName() != null && !user.getName().isEmpty()) ||
                (user.getEmail() != null && !user.getEmail().isEmpty()) ||
                (user.getPasswordHash() != null && !user.getPasswordHash().isEmpty())) {
            if (user.getName() != null)
                existingUser.setName(user.getName());
            if (user.getEmail() != null)
                existingUser.setEmail(user.getEmail());
            if (user.getPasswordHash() != null)
                existingUser.setPasswordHash(user.getPasswordHash());
            if (user.getRole() != null)
                existingUser.setRole(user.getRole());
        }
        Users updatedUser = userRepository.save(existingUser);
        return convertToDto(updatedUser);
    }

    @Transactional
    public void deleteUserByName(String name) {
        if (!userRepository.findByName(name).isPresent()) {
            throw new EntityNotFoundException("User not found with name: " + name);
        }
        userRepository.deleteByName(name);
    }

    @Transactional
    public UserDto syncClerkUser(String clerkId, String name, String email) {
        Users user = userRepository.findByClerkId(clerkId).orElse(null);
        if (user == null) {
            user = new Users();
            user.setClerkId(clerkId);
            user.setRole("USER");
        }
        if (name != null && !name.isEmpty())
            user.setName(name);
        if (email != null && !email.isEmpty())
            user.setEmail(email);
        Users saved = userRepository.save(user);
        return convertToDto(saved);
    }

    @Transactional
    public void upgradeUserToPro(String userIdOrClerkId) {
        Users user = null;
        try {
            Long id = Long.parseLong(userIdOrClerkId);
            user = userRepository.findById(id).orElse(null);
        } catch (NumberFormatException e) {
            // Not a Long, fallback to clerkId lookup
        }
        
        if (user == null) {
            user = userRepository.findByClerkId(userIdOrClerkId).orElse(null);
        }
        
        if (user == null) {
            // Auto-create user if they don't exist yet (e.g. sync was bypassed or offline)
            user = new Users();
            user.setClerkId(userIdOrClerkId);
            user.setName("Sandbox Pro User");
            user.setEmail("sandbox-pro-user@example.com");
        }
        
        user.setRole("PRO");
        userRepository.save(user);
    }

    private UserDto convertToDto(Users user) {
        return new UserDto(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
