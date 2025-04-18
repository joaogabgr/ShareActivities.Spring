package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.ChangeStatusImpl;
import com.joaogabgr.backend.web.dto.activities.ChangeStatusDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/activities")
public class ChangeStatusController {

    @Autowired
    private ChangeStatusImpl changeStatusImpl;

    @PutMapping("/changeStatus")
    public ResponseEntity<ResponseModelDTO> changeStatus(@RequestBody ChangeStatusDTO changeStatusDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(changeStatusImpl.execute(changeStatusDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
