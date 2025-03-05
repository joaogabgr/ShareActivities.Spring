package com.joaogabgr.backend.infra.repositories;

import com.joaogabgr.backend.core.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    User findByCpf(String cpf);
}