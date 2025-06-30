import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ProviderInfoProps {
  name: string;
  industry: string;
  address: string;
  tags?: string[];
}

const ProviderInfo: React.FC<ProviderInfoProps> = ({
  name,
  industry,
  address,
  tags = []
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>
        {name}
      </Text>
      
      <View style={styles.industryRow}>
        <MaterialCommunityIcons name="briefcase" size={16} color="#2563EB" />
        <Text style={styles.industry}>
          {industry}
        </Text>
      </View>
      
      <View style={styles.addressRow}>
        <MaterialCommunityIcons name="map-marker" size={16} color="#6B7280" />
        <Text style={styles.address}>
          {address}
        </Text>
      </View>
      
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.slice(0, 4).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },
  industryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  industry: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  address: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
});

export default ProviderInfo;