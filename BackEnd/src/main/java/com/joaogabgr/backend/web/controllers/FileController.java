package com.joaogabgr.backend.web.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {
    
    private static final Logger logger = Logger.getLogger(FileController.class.getName());

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @GetMapping("/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            logger.info("Solicitação para acessar o arquivo: " + fileName);
            
            Path filePath = Paths.get(uploadDir).resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists()) {
                // Determinar o tipo de mídia
                String contentType = determineContentType(fileName);
                
                logger.info("Arquivo encontrado: " + filePath.toAbsolutePath() + " - ContentType: " + contentType);
                
                // Configurar o cabeçalho para informar ao navegador para não abrir em uma nova aba
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                logger.warning("Arquivo não encontrado: " + filePath.toAbsolutePath());
                return ResponseEntity.notFound().build();
            }
        } catch (MalformedURLException e) {
            logger.log(Level.SEVERE, "URL malformada para o arquivo: " + fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            logger.log(Level.SEVERE, "Erro ao acessar o arquivo: " + fileName, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    private String determineContentType(String fileName) {
        if (fileName.endsWith(".pdf")) {
            return "application/pdf";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".doc") || fileName.endsWith(".docx")) {
            return "application/msword";
        } else {
            try {
                // Tentar determinar o tipo de conteúdo a partir do arquivo
                Path path = Paths.get(uploadDir).resolve(fileName);
                if (Files.exists(path)) {
                    return Files.probeContentType(path);
                }
            } catch (IOException e) {
                logger.warning("Não foi possível determinar o tipo de conteúdo para: " + fileName);
            }
            return "application/octet-stream";
        }
    }
} 