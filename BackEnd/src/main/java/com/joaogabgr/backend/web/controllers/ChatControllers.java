package com.joaogabgr.backend.web.controllers;

import com.joaogabgr.backend.application.services.Chat.ReadMessageImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatControllers {
    @Autowired
    private ReadMessageImpl readSendMessage;

    @GetMapping("/{roomId}")
    public ResponseEntity<ResponseModelDTO> execute(@PathVariable String roomId) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(readSendMessage.execute(roomId)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
