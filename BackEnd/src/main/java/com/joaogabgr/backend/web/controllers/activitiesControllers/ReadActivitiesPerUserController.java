package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.ReadActivitiesPerUserImpl;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/activities")
public class ReadActivitiesPerUserController {

    @Autowired
    private ReadActivitiesPerUserImpl readActivitiesPerUserImpl;

    @GetMapping("/list/{userID}")
    public ResponseEntity<ResponseModelDTO> readActivitiesPerUser(@PathVariable String userID) throws SystemContextException {
        try {
            return ResponseEntity.ok(new ResponseModelDTO(readActivitiesPerUserImpl.execute(userID)));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
