import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import ProviderCard from '../../../components/ProviderComponent/ProviderCard';
import GenericList from '../../../components/genericList';
import Header from '../../../components/header';
import SearchBar from '../../../components/searchBar';
import usefetch from "../../../hooks/useFetch";
import { getProviders } from '../../../utils/queryProv';

// Interface para el proveedor del backend 
interface Provider {
  _id: string;
  name: string;
  description?: string; // Opcional para coincidir con ProviderCard
  image: string;
  tags: string[];
  props: {
    legal_name?: string; // Opcional
    cuit?: string;
    industry?: string; // Opcional
    tax_address?: string; // Opcional
    phone_number?: string;
    email?: string;
  };
}

// Interface para la respuesta de la API
interface ProvidersApiResponse {
  path: string;
  method: string;
  error?: any;
  items: Provider[];
}

type Screen = 'index' | 'Proveedores' | 'Buscador' | 'Favoritos' | 'Configuracion';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [proveedoresFiltrados, setProveedoresFiltrados] = useState<Provider[]>([]);
  const [activeScreen, setActiveScreen] = useState<Screen>('index');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Hook para obtener datos del backend
  const { data: providers, execute: fetchProviders, loading: loadingProviders } = usefetch<ProvidersApiResponse>();

  // Obtener proveedores al cargar el componente
  useEffect(() => {
    fetchProviders({ method: 'post', url: '/api/findObjects', data: getProviders });
  }, []);

  // Efecto para filtrar proveedores cuando cambia la búsqueda o llegan nuevos datos
  useEffect(() => {
    if (!providers?.items) {
      setProveedoresFiltrados([]);
      return;
    }

    if (searchQuery.trim() === '') {
      // Si la búsqueda está vacía, mostrar todos los proveedores
      setProveedoresFiltrados(providers.items);
    } else {
      // Filtrar por nombre, industria o dirección con manejo de valores opcionales
      const filtrados = providers.items.filter(proveedor => 
        proveedor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (proveedor.props.industry && proveedor.props.industry.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (proveedor.props.tax_address && proveedor.props.tax_address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setProveedoresFiltrados(filtrados);
    }
  }, [searchQuery, providers]);

  // Función para manejar el cambio en el texto de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  // Función para manejar selección de proveedor
  const handleProviderPress = (provider: Provider) => {
    console.log(`Proveedor seleccionado: ${provider.name}`);
  };

  // Función para renderizar un proveedor - ACTUALIZADA con sistema de loading
  const renderProveedor = (proveedor: Provider) => (
    <ProviderCard
      provider={proveedor}
      variant="vertical"
      isLoading={false} // Los datos reales no están cargando
      // Sin onPress - usará la navegación por defecto
    />
  );

  // Función para renderizar proveedores en estado de loading
  const renderLoadingProveedor = (index: number) => (
    <ProviderCard
      key={`loading-${index}`}
      provider={{
        _id: `loading-${index}`,
        name: "Cargando nombre...",
        image: "",
        tags: [],
        props: {}
      }}
      variant="vertical"
      isLoading={true} // Activamos el estado de loading
    />
  );

  // Función para refrescar los datos
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchProviders({ method: 'post', url: '/api/findObjects', data: getProviders })
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  // Componente para mostrar cuando no hay resultados
  const NoResultsComponent = () => (
    <View style={styles.noResultsContainer}>
      <Text style={styles.noResultsText}>
        {searchQuery.trim() 
          ? `No se encontraron proveedores que coincidan con "${searchQuery}"`
          : "No hay proveedores disponibles"
        }
      </Text>
    </View>
  );

  // Componente de loading personalizado para la lista
  const LoadingComponent = () => (
    <View style={styles.listContent}>
      {Array.from({ length: 6 }).map((_, index) => renderLoadingProveedor(index))}
    </View>
  );

  const renderScreen = () => {
    switch (activeScreen) {
      case 'index':
        return (
          <>
            <Header 
              title="Proveedores" 
              subtitle="¿Qué estás buscando hoy?"
            >
              <SearchBar
                placeholder="Buscar proveedores"
                value={searchQuery}
                onChangeText={handleSearchChange}
              />
            </Header>
            
            {loadingProviders ? (
              <LoadingComponent />
            ) : (
              <GenericList
                data={proveedoresFiltrados}
                renderItem={renderProveedor}
                keyExtractor={(item) => item._id}
                ListEmptyComponent={<NoResultsComponent />}
                contentContainerStyle={styles.listContent}
                isLoading={false} // Ya manejamos el loading arriba
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                emptyText={searchQuery.trim() 
                  ? `No se encontraron proveedores que coincidan con "${searchQuery}"`
                  : "No hay proveedores disponibles"
                }
              />
            )}
          </>
        );
      case 'Buscador':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Búsqueda Avanzada</Text>
            <SearchBar
              placeholder="Buscar por nombre, industria o ciudad"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />
            {/* Mostrar resultados de búsqueda aquí si hay query */}
            {searchQuery.trim() !== '' && (
              <View style={{ marginTop: 20, flex: 1 }}>
                {loadingProviders ? (
                  <LoadingComponent />
                ) : (
                  <GenericList
                    data={proveedoresFiltrados}
                    renderItem={renderProveedor}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<NoResultsComponent />}
                    isLoading={false}
                  />
                )}
              </View>
            )}
          </View>
        );
      case 'Proveedores':
        return (
          <>
            <Header 
              title="Listado Completo" 
              subtitle="Todos los proveedores disponibles"
            />
            {loadingProviders ? (
              <LoadingComponent />
            ) : (
              <GenericList
                data={providers?.items || []}
                renderItem={renderProveedor}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.listContent}
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                isLoading={false}
                emptyText="No hay proveedores disponibles"
              />
            )}
          </>
        );
      case 'Favoritos':
        return (
          <>
            <Header 
              title="Favoritos" 
              subtitle="Tus proveedores guardados"
            />
            <GenericList
              data={[]} // Lista vacía para demostrar el emptyComponent
              renderItem={renderProveedor}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.listContent}
              emptyText="No tienes proveedores favoritos"
              isLoading={false}
            />
          </>
        );
      case 'Configuracion':
        return (
          <View style={styles.screenContainer}>
            <Text style={styles.screenTitle}>Configuración</Text>
            <Text style={styles.screenText}>Ajustes de la aplicación.</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {renderScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  listContent: {
    padding: 10,
    paddingBottom: 20,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  screenContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  screenText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default Index;