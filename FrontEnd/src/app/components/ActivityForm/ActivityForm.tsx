import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Linking,
  Switch,
} from "react-native";
import Header from "../../components/header/Header";
import { colors, fonts, shadows, spacing } from "@/src/globalCSS";
import { useRouter } from "expo-router";
import { links as apiLinks } from "@/src/api/api";
import { ErrorAlertComponent } from "@/src/app/components/Alerts/AlertComponent";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faTasksAlt,
  faTag,
  faAlignLeft,
  faFlag,
  faSave,
  faFile,
  faImage,
  faLink,
  faXmark,
  faUpload,
  faTimes,
  faChevronDown,
  faChevronUp,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { CreateActivities } from "@/src/types/Activities/CreateActivities";
import { UpdateActivities } from "@/src/types/Activities/UpdateActivities";
import { AuthContext } from "@/src/contexts/AuthContext";
import KeyboardAvoidingContainer from "@/src/app/components/KeyboardAvoidingContainer/KeyboardAvoidingContainer";
import DatePicker from "../DatePicker/DatePicker";
import StatusPicker from "../StatusPicker/StatusPicker";
import PriorityPicker from "../PriorityPicker/PriorityPicker";
import FormField from "../FormField/FormField";
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

interface ActivityFormProps {
  mode: "create" | "edit";
  activityData?: any; // Dados da atividade para edição
  onSuccess?: () => void;
  familyId?: string; // ID da família quando estiver criando uma atividade para um grupo
  familyName?: string; // Nome da família quando estiver criando uma atividade para um grupo
  initialData?: {
    [key: string]: any;
  };
}

export default function ActivityForm({ mode, activityData, onSuccess, familyId, familyName, initialData }: ActivityFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [dateCreate, setDateCreate] = useState<Date | null>(new Date());
  const [priority, setPriority] = useState<string>("MEDIUM");
  const [daysForRecover, setDaysForRecover] = useState(0);
  const [warning, setWarning] = useState<boolean>(() => true);
  
  // Estados para os novos campos
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [activity, setActivity] = useState<any>(null);
  const authContext = useContext(AuthContext);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    notes: false,
    dates: false,
    attachments: false,
  });

  useEffect(() => {
    if (mode === "edit" && activityData) {
      try {
        setActivity(activityData);
        setTitle(activityData.name || "");
        setDescription(activityData.description || "");
        setStatus(activityData.status || "PENDING");
        setDateCreate(activityData.dateCreated ? new Date(activityData.dateCreated) : new Date());
        setNotes(activityData.notes || "");
        setLocation(activityData.location || "");
        
        // Tratar o warning corretamente, convertendo string para booleano
        if (activityData.hasOwnProperty('warning')) {
          // Converter explicitamente para booleano, tratando o caso de string "false"
          const warningValue = activityData.warning === false || 
                               activityData.warning === "false" ? 
                               false : true;
          setWarning(warningValue);
        } else {
          setWarning(true);
        }
        
        // Configurar anexos se existirem
        setDocumentUrl(activityData.documentUrl || null);
        setPhotoUrl(activityData.photoUrl || null);
        
        // Carregar links
        if (activityData.linkUrl) {
          setLinks(activityData.linkUrl.split(';').filter((link: string) => link.trim() !== ''));
        }
        
        // Extrair o nome do documento da URL, se existir
        if (activityData.documentUrl) {
          const parts = activityData.documentUrl.split('/');
          setDocumentName(parts[parts.length - 1]);
        }
        
        // Configurar tipo se existir
        if (activityData.type) {
          setType(activityData.type);
        }
        
        // Configurar data de expiração se existir
        if (activityData.dateExpire) {
          const expireDate = new Date(activityData.dateExpire);
          // Ajusta o fuso horário
          expireDate.setHours(expireDate.getHours() - 3);
          setExpirationDate(expireDate);
        }

        // Configurar dias para recuperar se existir
        if (activityData.dayForRecover) {
          const dayForRecoverDate = new Date(activityData.dayForRecover).getTime();
          const activityDate = new Date(activityData.dateCreated).getTime();
          setDaysForRecover(Math.ceil((dayForRecoverDate - activityDate) / (1000 * 60 * 60 * 24)));
        }
        
        // Configurar prioridade se existir
        if (activityData.priority) {
          setPriority(activityData.priority);
        }
      } catch (error) {
        console.error("Erro ao processar dados da atividade:", error);
        setWarning(true);
      } finally {
        setIsLoading(false);
      }
    } else if (mode === "create" && initialData) {
      setTitle(initialData.name || "");
      setDescription(initialData.description || "");
      setStatus(initialData.status || "PENDING");
      setType(initialData.type || "");
      setPriority(initialData.priority || "MEDIUM");
      setNotes(initialData.notes || "");
      setLocation(initialData.location || "");
      setWarning(
        initialData.warning === false || initialData.warning === "false"
          ? false
          : true
      );
      // Preenche data de expiração se vier como string ISO, Date ou MM/DD
      if (initialData.dateExpire) {
        let expireDate: Date | null = null;
        if (typeof initialData.dateExpire === 'string') {
          // Trata MM/DD
          if (/^\d{1,2}\/\d{1,2}$/.test(initialData.dateExpire)) {
            const [month, day] = initialData.dateExpire.split('/').map(Number);
            const now = new Date();
            let year = now.getFullYear();
            const tempDate = new Date(year, month - 1, day, 12, 0, 0, 0);
            if (tempDate < now) year++;
            expireDate = new Date(year, month - 1, day, 12, 0, 0, 0);
          } else {
            const tryDate = new Date(initialData.dateExpire);
            expireDate = isNaN(tryDate.getTime()) ? null : tryDate;
          }
        } else if (initialData.dateExpire instanceof Date) {
          expireDate = initialData.dateExpire;
        }
        setExpirationDate(expireDate);
      } else {
        setExpirationDate(null);
      }
      // Preenche dias para recuperar
      if (initialData.daysForRecover || initialData.daysforrecover) {
        setDaysForRecover(Number(initialData.daysForRecover || initialData.daysforrecover) || 0);
      } else {
        setDaysForRecover(0);
      }
      setDateCreate(new Date());
      setIsLoading(false);
    } else {
      // Criar nova atividade, definindo os padrões
      setDateCreate(new Date());
      setWarning(true);
      setIsLoading(false);
    }
  }, [mode, activityData, familyId, initialData]);

  // Funções para lidar com anexos
  const selectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword'],
        copyToCacheDirectory: true,
      });
      
      if (result.canceled === false) {
        // Guardar o nome e a URI do documento
        setDocumentName(result.assets[0].name);
        setDocumentUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      ErrorAlertComponent('Erro', 'Não foi possível selecionar o documento.');
    }
  };

  const selectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        ErrorAlertComponent('Permissão negada', 'Precisamos de permissão para acessar sua galeria de fotos.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });
      
      if (!result.canceled) {
        // Salvar o URI para renderização da imagem
        setPhotoUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      ErrorAlertComponent('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const addLink = () => {
    if (links.length >= 3) {
      ErrorAlertComponent('Limite atingido', 'Você já adicionou o máximo de 3 links permitidos.');
      return;
    }
    
    Alert.prompt(
      "Adicionar Link",
      "Insira a URL completa (incluindo http:// ou https://)",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Adicionar",
          onPress: (url) => {
            if (!url) {
              return;
            }
            
            // Validação simples de URL
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              ErrorAlertComponent('URL inválida', 'A URL deve começar com http:// ou https://');
              return;
            }
            
            setLinks([...links, url]);
          }
        }
      ],
      "plain-text",
      "",
      "url"
    );
  };

  const removeLink = (index: number) => {
    const updatedLinks = [...links];
    updatedLinks.splice(index, 1);
    setLinks(updatedLinks);
  };

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        ErrorAlertComponent('Erro', 'Não é possível abrir esta URL: ' + url);
      }
    });
  };

  const validateForm = () => {
    // Validação mais específica dos campos obrigatórios
    if (!title.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o nome da atividade."
      );
      return false;
    }

    if (!description.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha a descrição da atividade."
      );
      return false;
    }

    if (!type.trim()) {
      ErrorAlertComponent(
        "Campo obrigatório",
        "Por favor, preencha o tipo da atividade."
      );
      return false;
    }

    // Validação de tamanho mínimo
    if (title.trim().length < 3) {
      ErrorAlertComponent(
        "Nome muito curto",
        "O nome da atividade deve ter pelo menos 3 caracteres."
      );
      return false;
    }

    if (description.trim().length < 10) {
      ErrorAlertComponent(
        "Descrição muito curta",
        "A descrição da atividade deve ter pelo menos 10 caracteres."
      );
      return false;
    }

    // Validação de dias para recuperar
    if (daysForRecover < 0) {
      ErrorAlertComponent(
        "Valor inválido",
        "Os dias para recuperar não podem ser negativos."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Se tiver data de expiração, ajusta para o final do dia
    let formattedDate = null;
    if (expirationDate) {
      formattedDate = new Date(expirationDate);
      formattedDate.setHours(23, 59, 59, 999);
    }

    // Juntar os links com ponto e vírgula
    const formattedLinks = links.length > 0 ? links.join(';') : null;

    try {
      // Upload dos arquivos e obtenção das URLs
      let photoUrlServer = null;
      let photoNameServer = null;
      let documentUrlServer = null;
      let documentNameServer = null;

      // Upload de foto se existir
      if (photoUrl) {
        const photoFormData = new FormData();
        
        // Cria um nome curto para o arquivo para evitar URLs longas
        const shortPhotoName = `photo_${Date.now().toString().slice(-6)}.jpg`;
        
        // Cria um arquivo para upload
        const photoFile = {
          uri: photoUrl,
          name: shortPhotoName,
          type: 'image/jpeg'
        };
        
        // @ts-ignore - TypeScript não reconhece a estrutura corretamente, mas funciona
        photoFormData.append('file', photoFile);
        
        const photoResponse = await fetch(`${apiLinks.API_URL}/api/upload/file`, {
          method: 'POST',
          body: photoFormData,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (photoResponse.ok) {
          const photoData = await photoResponse.json();
          photoUrlServer = photoData.url;
          photoNameServer = photoData.fileName;
        }
      }
      
      // Upload de documento se existir
      if (documentUrl && documentName) {
        const documentFormData = new FormData();
        
        // Cria um nome curto para o arquivo para evitar URLs longas
        const docExt = documentName.endsWith('.pdf') ? 'pdf' : 'doc';
        const shortDocName = `doc_${Date.now().toString().slice(-6)}.${docExt}`;
        
        // Cria um arquivo para upload
        const documentFile = {
          uri: documentUrl,
          name: shortDocName,
          type: documentName.endsWith('.pdf') ? 'application/pdf' : 'application/msword'
        };
        
        // @ts-ignore - TypeScript não reconhece a estrutura corretamente, mas funciona
        documentFormData.append('file', documentFile);
        
        const documentResponse = await fetch(`${apiLinks.API_URL}/api/upload/file`, {
          method: 'POST',
          body: documentFormData,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (documentResponse.ok) {
          const documentData = await documentResponse.json();
          documentUrlServer = documentData.url;
          documentNameServer = documentData.fileName;
        }
      }

      if (mode === "create") {
        // Criar nova atividade
        const newActivity: CreateActivities = {
          name: title,
          description: description,
          status: status,
          userId: authContext.user?.name || "",
          type: type,
          dateExpire: formattedDate ? formattedDate.toISOString() : null,
          dateCreated: dateCreate ? dateCreate.toISOString() : new Date().toISOString(),
          priority: priority,
          daysForRecover: daysForRecover,
          familyId: familyId || "",
          notes: notes,
          location: location,
          documentUrl: documentUrlServer,
          photoUrl: photoUrlServer,
          documentName: documentNameServer,
          photoName: photoNameServer,
          linkUrl: formattedLinks,
          warning: warning,
        };

        await apiLinks.createActivity(newActivity);
      } else if (mode === "edit" && activity) {
        const activityFamilyId = familyId || "";
        const formatedDateCreated = dateCreate ? new Date(dateCreate) : null;

        const updateActivity: UpdateActivities = {
          id: activity.id,
          name: title,
          description: description,
          status: status,
          userId: authContext.user?.name || "",
          type: type,
          dateExpire: formattedDate ? formattedDate.toISOString() : "",
          dateCreated: formatedDateCreated ? formatedDateCreated.toISOString() : new Date().toISOString(),
          priority: priority,
          daysForRecover: daysForRecover,
          familyId: activityFamilyId,
          notes: notes,
          location: location,
          documentUrl: documentUrlServer,
          photoUrl: photoUrlServer,
          documentName: documentNameServer,
          photoName: photoNameServer,
          linkUrl: formattedLinks,
          warning: warning,
        };
        
        await apiLinks.updateActivity(updateActivity);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.back()
      }
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
      ErrorAlertComponent("Erro", "Não foi possível salvar a atividade. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev]
    }));
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando atividade...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <KeyboardAvoidingContainer>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>
              {mode === "create" ? "Nova Atividade" : "Editar Atividade"}
              {familyName ? ` - ${familyName}` : ""}
            </Text>

            <View style={[styles.formContainer, shadows.medium]}>
              {/* Seção Básica */}
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => toggleSection('basic')}
              >
                <Text style={styles.sectionTitle}>Informações Básicas *</Text>
                <FontAwesomeIcon 
                  icon={expandedSections.basic ? faChevronUp : faChevronDown} 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {expandedSections.basic && (
                <View style={styles.sectionContent}>
                  <FormField
                    label="Nome da atividade"
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Digite o nome da atividade"
                    icon={faTasksAlt}
                    required
                  />

                  <FormField
                    label="Descrição"
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Digite a descrição da atividade"
                    icon={faAlignLeft}
                    required
                  />

                  <FormField
                    label="Tipo"
                    value={type}
                    onChangeText={setType}
                    placeholder="Digite o tipo da atividade"
                    icon={faTag}
                    required
                  />

                  <StatusPicker
                    status={status}
                    onStatusChange={setStatus}
                  />

                  <PriorityPicker
                    priority={priority}
                    onPriorityChange={setPriority}
                  />
                  
                  {/* Novo campo de notificação */}
                  <View style={styles.toggleContainer}>
                    <View style={styles.toggleLabelContainer}>
                      <FontAwesomeIcon icon={faBell} size={16} color={colors.primary} />
                      <Text style={styles.toggleLabel}>Receber avisos de vencimento</Text>
                    </View>
                    <Switch
                      trackColor={{ false: colors.divider, true: colors.primary }}
                      thumbColor={warning ? colors.textLight : colors.surface}
                      ios_backgroundColor={colors.divider}
                      onValueChange={() => {
                        const newValue = !warning;
                        setWarning(newValue);
                      }}
                      value={warning}
                    />
                  </View>
                </View>
              )}

              {/* Seção de Notas e Localização */}
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => toggleSection('notes')}
              >
                <Text style={styles.sectionTitle}>Notas e Localização</Text>
                <FontAwesomeIcon 
                  icon={expandedSections.notes ? faChevronUp : faChevronDown} 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {expandedSections.notes && (
                <View style={styles.sectionContent}>
                  <FormField
                    label="Notas"
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Digite notas ou links relacionados à atividade"
                    icon={faAlignLeft}
                    isLinksField={true}
                  />

                  <FormField
                    label="Endereço"
                    value={location}
                    onChangeText={setLocation}
                    placeholder="Digite o endereço aonde a atividade será realizada"
                    icon={faTag}
                  />
                </View>
              )}

              {/* Seção de Datas */}
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => toggleSection('dates')}
              >
                <Text style={styles.sectionTitle}>Datas e Recorrência</Text>
                <FontAwesomeIcon 
                  icon={expandedSections.dates ? faChevronUp : faChevronDown} 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {expandedSections.dates && (
                <View style={styles.sectionContent}>
                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerWrapper}>
                      <DatePicker
                        date={dateCreate}
                        onDateChange={(newDate) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const selectedDate = new Date(newDate);
                          selectedDate.setHours(0, 0, 0, 0);
                          
                          if (selectedDate >= today) {
                            setDateCreate(newDate);
                          } else {
                            ErrorAlertComponent(
                              "Data inválida",
                              "A data não pode ser no passado."
                            );
                          }
                        }}
                        label="Data"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setDateCreate(null)}
                    >
                      <FontAwesomeIcon icon={faTimes} size={14} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.datePickerContainer}>
                    <View style={styles.datePickerWrapper}>
                      <DatePicker
                        date={expirationDate}
                        onDateChange={(newDate) => {
                          if (!dateCreate) {
                            ErrorAlertComponent(
                              "Data inválida",
                              "Por favor, selecione primeiro a data."
                            );
                            return;
                          }

                          const selectedDate = new Date(newDate);
                          const creationDate = new Date(dateCreate);
                          
                          selectedDate.setHours(0, 0, 0, 0);
                          creationDate.setHours(0, 0, 0, 0);
                          
                          if (selectedDate > creationDate) {
                            setExpirationDate(newDate);
                          } else {
                            ErrorAlertComponent(
                              "Data inválida",
                              "A data de expiração deve ser posterior à data."
                            );
                          }
                        }}
                        label="Data de expiração"
                      />
                    </View>
                    <TouchableOpacity
                      style={styles.clearButton}
                      onPress={() => setExpirationDate(null)}
                    >
                      <FontAwesomeIcon icon={faTimes} size={14} color={colors.error} />
                    </TouchableOpacity>
                  </View>

                  <FormField
                    label="Dias para recuperar"
                    value={daysForRecover.toString()}
                    onChangeText={(text) => setDaysForRecover(Number(text.replace(/[^0-9]/g, "")))}
                    placeholder="Digite a quantidade de dias para recuperar"
                    icon={faFlag}
                    keyboardType="numeric"
                  />
                </View>
              )}

              {/* Seção de Anexos */}
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => toggleSection('attachments')}
              >
                <Text style={styles.sectionTitle}>Anexos</Text>
                <FontAwesomeIcon 
                  icon={expandedSections.attachments ? faChevronUp : faChevronDown} 
                  size={16} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>

              {expandedSections.attachments && (
                <View style={styles.sectionContent}>
                  <Text style={styles.attachmentsSubtitle}>Adicione até um documento, foto e links</Text>
                  
                  {/* Documento */}
                  <View style={styles.attachmentItem}>
                    <View style={styles.attachmentHeader}>
                      <View style={styles.attachmentTitleContainer}>
                        <FontAwesomeIcon icon={faFile} size={16} color={colors.primary} />
                        <Text style={styles.attachmentTypeTitle}>Documento</Text>
                      </View>
                      
                      {!documentUrl ? (
                        <TouchableOpacity
                          style={styles.attachButton}
                          onPress={selectDocument}
                        >
                          <FontAwesomeIcon icon={faUpload} size={14} color={colors.primary} />
                          <Text style={styles.attachButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.attachButton, styles.removeButton]}
                          onPress={() => {
                            setDocumentUrl(null);
                            setDocumentName(null);
                          }}
                        >
                          <FontAwesomeIcon icon={faXmark} size={14} color={colors.error} />
                          <Text style={[styles.attachButtonText, styles.removeButtonText]}>Remover</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {documentUrl && documentName && (
                      <View style={styles.attachmentPreview}>
                        <FontAwesomeIcon icon={faFile} size={20} color={colors.primary} />
                        <Text style={styles.documentName} numberOfLines={1} ellipsizeMode="middle">
                          {documentName}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  {/* Foto */}
                  <View style={styles.attachmentItem}>
                    <View style={styles.attachmentHeader}>
                      <View style={styles.attachmentTitleContainer}>
                        <FontAwesomeIcon icon={faImage} size={16} color={colors.primary} />
                        <Text style={styles.attachmentTypeTitle}>Foto</Text>
                      </View>
                      
                      {!photoUrl ? (
                        <TouchableOpacity
                          style={styles.attachButton}
                          onPress={selectImage}
                        >
                          <FontAwesomeIcon icon={faUpload} size={14} color={colors.primary} />
                          <Text style={styles.attachButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.attachButton, styles.removeButton]}
                          onPress={() => setPhotoUrl(null)}
                        >
                          <FontAwesomeIcon icon={faXmark} size={14} color={colors.error} />
                          <Text style={[styles.attachButtonText, styles.removeButtonText]}>Remover</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {photoUrl && (
                      <Image 
                        source={{ uri: photoUrl }} 
                        style={styles.imagePreview} 
                        resizeMode="cover"
                      />
                    )}
                  </View>
                  
                  {/* Link */}
                  <View style={styles.attachmentItem}>
                    <View style={styles.attachmentHeader}>
                      <View style={styles.attachmentTitleContainer}>
                        <FontAwesomeIcon icon={faLink} size={16} color={colors.primary} />
                        <Text style={styles.attachmentTypeTitle}>Links (máx. 3)</Text>
                      </View>
                      
                      {links.length < 3 && (
                        <TouchableOpacity
                          style={styles.attachButton}
                          onPress={addLink}
                        >
                          <FontAwesomeIcon icon={faUpload} size={14} color={colors.primary} />
                          <Text style={styles.attachButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    {links.length > 0 ? (
                      <View style={styles.linksContainer}>
                        {links.map((url, index) => (
                          <View key={index} style={styles.linkItem}>
                            <TouchableOpacity 
                              style={styles.linkPreview}
                              onPress={() => openLink(url)}
                            >
                              <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                                {url}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.removeLinkButton}
                              onPress={() => removeLink(index)}
                            >
                              <FontAwesomeIcon icon={faXmark} size={14} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    ) : (
                      <Text style={styles.noLinksText}>Nenhum link adicionado</Text>
                    )}
                  </View>
                </View>
              )}

              {/* Botões */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[styles.cancelButton, shadows.small]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitButton, shadows.small]}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color={colors.textLight} />
                  ) : (
                    <>
                      {mode === "edit" && (
                        <FontAwesomeIcon 
                          icon={faSave} 
                          size={18} 
                          color={colors.textLight} 
                          style={styles.submitButtonIcon} 
                        />
                      )}
                      <Text style={styles.submitButtonText}>
                        {mode === "create" ? "Criar Atividade" : "Salvar Alterações"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: spacing.medium,
    fontSize: fonts.size.medium,
    color: colors.textSecondary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xxl,
  },
  content: {
    padding: spacing.medium,
  },
  title: {
    fontSize: fonts.size.xxl,
    fontWeight: fonts.weight.bold,
    color: colors.textPrimary,
    marginBottom: spacing.large,
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.large,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.large,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginRight: spacing.small,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: spacing.medium,
    alignItems: "center",
    marginLeft: spacing.small,
    flexDirection: "row",
    justifyContent: "center",
  },
  submitButtonText: {
    color: colors.textLight,
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.semiBold,
  },
  submitButtonIcon: {
    marginRight: spacing.xs,
  },
  attachmentsSection: {
    marginTop: spacing.large,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: spacing.medium,
  },
  attachmentsTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  attachmentsSubtitle: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    marginBottom: spacing.medium,
  },
  attachmentItem: {
    marginBottom: spacing.medium,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    padding: spacing.medium,
    backgroundColor: colors.background,
  },
  attachmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.small,
  },
  attachmentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentTypeTitle: {
    fontSize: fonts.size.medium,
    fontWeight: fonts.weight.medium,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.small,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  attachButtonText: {
    fontSize: fonts.size.xs,
    color: colors.primary,
    marginLeft: spacing.xs,
  },
  removeButton: {
    borderColor: colors.error,
  },
  removeButtonText: {
    color: colors.error,
  },
  attachmentPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 4,
  },
  documentName: {
    flex: 1,
    fontSize: fonts.size.small,
    color: colors.textPrimary,
    marginLeft: spacing.small,
  },
  imagePreview: {
    width: '100%',
    height: 150,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  linksContainer: {
    marginTop: spacing.small,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.small,
    backgroundColor: colors.surface,
    borderRadius: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.small,
  },
  linkPreview: {
    flex: 1,
  },
  linkText: {
    fontSize: fonts.size.small,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  removeLinkButton: {
    padding: spacing.xs,
  },
  noLinksText: {
    fontSize: fonts.size.small,
    color: colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: spacing.small,
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  datePickerWrapper: {
    flex: 1,
  },
  clearButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.error,
    marginLeft: spacing.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  sectionTitle: {
    fontSize: fonts.size.large,
    fontWeight: fonts.weight.semiBold,
    color: colors.textPrimary,
  },
  sectionContent: {
    paddingVertical: spacing.medium,
  },
  // Estilos para o novo toggle
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.medium,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  toggleLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    marginLeft: spacing.small,
    fontSize: fonts.size.medium,
    color: colors.textPrimary,
  },
});