import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import * as Location from 'expo-location';

interface Coordenadas {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

interface LocationContextData {
  localizacaoUsuario: Coordenadas | null;
  carregando: boolean;
  erro: string | null;
  solicitarPermissao: () => Promise<void>;
  atualizarLocalizacao: () => Promise<void>;
}

const LocationContext = createContext<LocationContextData>({
  localizacaoUsuario: null,
  carregando: true,
  erro: null,
  solicitarPermissao: async () => {},
  atualizarLocalizacao: async () => {},
});

export const useLocation = () => useContext(LocationContext);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Coordenadas | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const solicitarPermissao = async () => {
    setCarregando(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErro('A permissão para acessar a localização foi negada');
        setCarregando(false);
        return;
      }
      await atualizarLocalizacao();
    } catch (err) {
      setErro('Erro ao solicitar permissão de localização');
      setCarregando(false);
    }
  };

  const atualizarLocalizacao = async () => {
    try {
      const localizacaoAtual = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (!localizacaoAtual.coords.accuracy) {
        setErro('Erro ao obter localização atual');
        return;
      }
      
      setLocalizacaoUsuario({
        latitude: localizacaoAtual.coords.latitude,
        longitude: localizacaoAtual.coords.longitude,
        accuracy: localizacaoAtual.coords.accuracy,
      });
      
      setErro(null);
    } catch (err) {
      setErro('Erro ao obter localização atual');
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    solicitarPermissao();
    
    // Atualiza a localização a cada 1 minuto
    const intervalo = setInterval(() => {
      if (!carregando) {
        atualizarLocalizacao();
      }
    }, 60000);
    
    return () => clearInterval(intervalo);
  }, []);

  const value = {
    localizacaoUsuario,
    carregando,
    erro,
    solicitarPermissao,
    atualizarLocalizacao,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext; 