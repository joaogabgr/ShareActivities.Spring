package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.ChangeStatusImpl;
import com.joaogabgr.backend.web.dto.activities.ConfirmGroupDoneDTO;
import com.joaogabgr.backend.web.dto.web.ResponseModelDTO;
import com.joaogabgr.backend.web.exeption.SystemContextException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/activities")
public class ConfirmGroupDoneController {

    @Autowired
    private ChangeStatusImpl changeStatusImpl;

    @PostMapping("/confirmGroupDone")
    public ResponseEntity<ResponseModelDTO> confirmGroupDone(@RequestBody ConfirmGroupDoneDTO dto) throws SystemContextException {
        String result = changeStatusImpl.confirmGroupDone(dto.getId(), dto.getUserEmail());
        return ResponseEntity.ok(new ResponseModelDTO(result));
    }
}
