package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.DeleteActivitiesImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activities")
public class DeleteActivitiesController {

    @Autowired
    private DeleteActivitiesImpl deleteActivitiesImpl;

    @DeleteMapping("/delete/{activitiesID}")
    public ResponseEntity<ResponseModelDTO> deleteActivities(@PathVariable String activitiesID ) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(deleteActivitiesImpl.execute(activitiesID)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
