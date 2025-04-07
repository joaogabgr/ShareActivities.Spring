# Configuração do Firebase para Notificações Push

## Passos necessários para completar a configuração

### 1. Criar projeto no Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Dê um nome ao seu projeto (ex: ShareActivities)
4. Siga as instruções para criar o projeto

### 2. Adicionar aplicativo Android

1. No console do Firebase, clique no ícone do Android para adicionar um aplicativo
2. Digite o nome do pacote do seu aplicativo: `com.joaogabgr.ToDoMobile` (conforme definido no app.json)
3. Digite um apelido para o aplicativo (opcional)
4. Clique em "Registrar aplicativo"

### 3. Baixar o arquivo de configuração

1. Baixe o arquivo `google-services.json` gerado
2. Coloque este arquivo na pasta raiz do seu projeto Android:
   - `FrontEnd/android/app/google-services.json`

### 4. Configurar o build.gradle

Verifique se os seguintes arquivos estão configurados corretamente:

#### android/build.gradle
Adicione o classpath do Google Services no bloco `buildscript > dependencies`:
```gradle
buildscript {
    dependencies {
        // ... outras dependências
        classpath 'com.google.gms:google-services:4.3.15'
    }
}
```

#### android/app/build.gradle
Adicione o plugin do Google Services no topo do arquivo, após outros plugins:
```gradle
apply plugin: 'com.google.gms.google-services'
```

### 5. Executar o aplicativo

Após realizar essas configurações, execute o aplicativo novamente com:

```
npm run android
```

## Solução de problemas

Se você continuar enfrentando problemas com as notificações push:

1. Verifique se o arquivo `google-services.json` está no local correto
2. Certifique-se de que o nome do pacote no Firebase corresponde ao definido no app.json
3. Verifique os logs do aplicativo para mensagens de erro específicas
4. Consulte a [documentação oficial do Expo](https://docs.expo.dev/push-notifications/using-fcm/) para mais detalhes