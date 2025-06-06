package com.joaogabgr.backend.web.controllers.activitiesControllers;

import com.joaogabgr.backend.application.services.activities.CreateActivitiesImpl;
import com.joaogabgr.backend.application.services.activities.GeminiClient;
import com.joaogabgr.backend.web.dto.activities.CreateActivitiesDTO;
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
public class CreateActivitiesController {

    @Autowired
    private CreateActivitiesImpl createActivitiesImpl;

    @Autowired
    private GeminiClient geminiClient;

    @PostMapping("/create")
    public ResponseEntity<ResponseModelDTO> createActivities(@RequestBody CreateActivitiesDTO createActivitiesDTO) throws SystemContextException {
       try {
           System.out.println(createActivitiesDTO);
              return ResponseEntity.ok(new ResponseModelDTO(createActivitiesImpl.execute(createActivitiesDTO)));
         } catch (Exception e) {
              throw new SystemContextException(e.getMessage());
       }
    }

    @PostMapping("/create/gemini")
    public ResponseEntity<ResponseModelDTO> createActivitiesWithGemini(@RequestBody String textoTranscrito) throws SystemContextException {
        try {
            String jsonResponse = geminiClient.execute(textoTranscrito);
            if (jsonResponse == null) {
                throw new SystemContextException("Erro ao processar o texto com Gemini");
            }
            return ResponseEntity.ok(new ResponseModelDTO(jsonResponse));
        } catch (Exception e) {
            throw new SystemContextException(e.getMessage());
        }
    }
}
