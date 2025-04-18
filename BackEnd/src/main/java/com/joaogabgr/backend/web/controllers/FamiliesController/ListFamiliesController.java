package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.ListFamiliesImpl;
import com.joaogabgr.backend.core.domain.models.FamiliesUsers;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/families")
public class ListFamiliesController {

    @Autowired
    private ListFamiliesImpl listFamiliesImpl;

    @GetMapping("/listFamilies/{userEmail}")
    public ResponseEntity<ResponseModelDTO> listFamilies(@PathVariable String userEmail) {
        return ResponseEntity.ok(new ResponseModelDTO(listFamiliesImpl.execute(userEmail)));
    }
}
