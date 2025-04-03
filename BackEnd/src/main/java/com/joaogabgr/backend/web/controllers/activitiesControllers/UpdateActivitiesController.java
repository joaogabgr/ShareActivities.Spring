package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.UpdateActivitiesImpl;
import com.joaogabgr.backend.core.domain.models.Activities;
import com.joaogabgr.backend.infra.repositories.ActivitiesRepository;
import com.joaogabgr.backend.web.dto.activities.UpdateActivitiesDTO;
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
public class UpdateActivitiesController {

    @Autowired
    private UpdateActivitiesImpl updateActivitiesImpl;

    @PutMapping("/update")
    public ResponseEntity<ResponseModelDTO> updateActivities(@RequestBody UpdateActivitiesDTO updateActivitiesDTO) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(updateActivitiesImpl.execute(updateActivitiesDTO)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
