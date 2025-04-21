package com.joaogabgr.backend.web.controllers.FamiliesController;

import com.joaogabgr.backend.application.services.families.ListMemberToFamily;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/families")
public class ListMemberFamilyController {
    @Autowired
    private ListMemberToFamily listMemberToFamily;

    @GetMapping("/listMemberFamily/{familyId}")
    public ResponseEntity<ResponseModelDTO> listMemberFamily(@PathVariable String familyId) {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(listMemberToFamily.execute(familyId)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ResponseModelDTO(e.getMessage()));
        }
    }
}
