package com.portfoliohub.backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.portfoliohub.backend.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);
}
