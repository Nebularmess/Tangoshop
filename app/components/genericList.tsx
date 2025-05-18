import React from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

interface GenericListProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  ListEmptyComponent?: React.ReactNode | (() => React.ReactNode);
  ListHeaderComponent?: React.ReactNode | (() => React.ReactNode);
  ListFooterComponent?: React.ReactNode | (() => React.ReactNode);
  contentContainerStyle?: object;
  isLoading?: boolean;
  onRefresh?: () => void;
  refreshing?: boolean;
  loadingText?: string;
  emptyText?: string;
  showsVerticalScrollIndicator?: boolean;
}

function GenericList<T>({
  data,
  renderItem,
  keyExtractor = (_, index) => index.toString(),
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  contentContainerStyle,
  isLoading = false,
  onRefresh,
  refreshing = false,
  loadingText = 'Cargando...',
  emptyText = 'No hay elementos para mostrar',
  showsVerticalScrollIndicator = true,
}: GenericListProps<T>) {
  // Componente por defecto para lista vacía si no se proporciona uno
  const DefaultEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>{emptyText}</Text>
    </View>
  );

  // Componente de carga
  const LoadingComponent = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0095ff" />
      <Text style={styles.loadingText}>{loadingText}</Text>
    </View>
  );

  // Función para renderizar componentes que pueden ser ReactNode o funciones que devuelven ReactNode
  const renderComponent = (component: React.ReactNode | (() => React.ReactNode)) => {
    if (typeof component === 'function') {
      return component();
    }
    return component;
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            data.length === 0 && styles.emptyScrollContent,
            contentContainerStyle
          ]}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {ListHeaderComponent && renderComponent(ListHeaderComponent)}
          
          {data.length > 0 ? (
            data.map((item, index) => (
              <React.Fragment key={keyExtractor(item, index)}>
                {renderItem(item, index)}
              </React.Fragment>
            ))
          ) : (
            ListEmptyComponent ? renderComponent(ListEmptyComponent) : <DefaultEmptyComponent />
          )}
          
          {ListFooterComponent && renderComponent(ListFooterComponent)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  emptyScrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default GenericList;