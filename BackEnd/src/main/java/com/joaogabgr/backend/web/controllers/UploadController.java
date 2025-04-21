package com.joaogabgr.backend.web.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")  // Permitir acesso de qualquer origem para desenvolvimento
public class UploadController {
    
    private static final Logger logger = Logger.getLogger(UploadController.class.getName());

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/file")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            // Criar diretório de upload se não existir
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }
            
            // Gerar nome de arquivo único
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String fileName = UUID.randomUUID().toString() + extension;
            
            // Verificar se o arquivo já existe e evitar colisões
            Path filePath = Paths.get(uploadDir, fileName);
            while (Files.exists(filePath)) {
                fileName = UUID.randomUUID().toString() + extension;
                filePath = Paths.get(uploadDir, fileName);
            }
            
            // Salvar arquivo (sobrescrever se existir)
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Registrar informações de debug
            logger.info("Arquivo salvo: " + filePath.toAbsolutePath());
            
            // Construir URL completa para acessar o arquivo
            String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
            String fileUrl = baseUrl + "/api/files/" + fileName;
            
            response.put("url", fileUrl);
            response.put("fileName", originalFileName);
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            logger.severe("Erro ao fazer upload: " + e.getMessage());
            response.put("error", "Falha ao fazer upload do arquivo: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
} 