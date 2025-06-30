import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Provider {
  _id: string;
  name: string;
  image: string;
  tags: string[];
  props: {
    legal_name: string;
    industry: string;
    tax_address: string;
    phone_number?: string;
    email?: string;
  };
}

interface ProviderCardProps {
  provider: Provider;
  variant?: 'horizontal' | 'vertical';
  onPress?: (provider: Provider) => void;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  variant = 'horizontal',
  onPress 
}) => {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress(provider);
    } else {
      router.push(`/(index)/(Providers)/${provider._id}`);
    }
  };

  const parseAddress = (address: string) => {
    const parts = address.split(' - ');
    if (parts.length >= 3) {
      const street = parts[0];
      const city = parts[1];
      const province = parts[2];
      return { street, city, province };
    }
    return { street: address, city: '', province: '' };
  };

  const { street, city, province } = parseAddress(provider.props.tax_address);

  if (variant === 'vertical') {
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.verticalCard}
        activeOpacity={0.8}
      >
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Image
              source={{ uri: provider.image }}
              style={styles.avatar}
              resizeMode='cover'
            />

            <View style={styles.mainInfo}>
              <Text style={styles.providerName} numberOfLines={1}>
                {provider.name}
              </Text>
              
              <View style={styles.industryRow}>
                <MaterialCommunityIcons name="briefcase" size={16} color="#2563EB" />
                <Text style={styles.industryText} numberOfLines={1}>
                  {provider.props.industry}
                </Text>
              </View>

              <View style={styles.contactRow}>
                <View style={styles.contactLeft}>
                  {provider.props.phone_number && (
                    <View style={styles.contactItem}>
                      <MaterialCommunityIcons name="phone" size={14} color="#6B7280" />
                      <Text style={styles.contactText} numberOfLines={1}>
                        {provider.props.phone_number}
                      </Text>
                    </View>
                  )}
                  
                  {provider.props.email && (
                    <View style={styles.contactItem}>
                      <MaterialCommunityIcons name="email" size={14} color="#6B7280" />
                      <Text style={styles.contactText}>
                        {provider.props.email}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={styles.contactRight}>
                  {(city || province) && (
                    <View style={styles.contactItem}>
                      <MaterialCommunityIcons name="map-marker" size={14} color="#6B7280" />
                      <Text style={styles.contactText} numberOfLines={1}>
                        {city}{city && province ? ', ' : ''}{province}
                      </Text>
                    </View>
                  )}
                  
                  {street && (
                    <View style={styles.contactItem}>
                      <MaterialCommunityIcons name="home" size={14} color="#6B7280" />
                      <Text style={styles.contactText} numberOfLines={1}>
                        {street}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View style={styles.chevronContainer}>
              <MaterialCommunityIcons name="chevron-right" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.horizontalCard}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: provider.image }}
          style={styles.headerImage}
          resizeMode='cover'
        />
        <View style={styles.overlay} />
        
        <View style={styles.badge}>
          <MaterialCommunityIcons name="store" size={12} color="#2563EB" />
          <Text style={styles.badgeText}>Comercio</Text>
        </View>
      </View>

      <View style={styles.horizontalContent}>
        <Text style={styles.horizontalName} numberOfLines={1}>
          {provider.name}
        </Text>
        
        <View style={styles.industryBadge}>
          <MaterialCommunityIcons name="briefcase-outline" size={12} color="#2563EB" />
          <Text style={styles.industryBadgeText} numberOfLines={1}>
            {provider.props.industry}
          </Text>
        </View>

        <View style={styles.horizontalContactRow}>
          <View style={styles.contactLeft}>
            {provider.props.phone_number && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="phone" size={12} color="#6B7280" />
                <Text style={styles.smallContactText} numberOfLines={1}>
                  {provider.props.phone_number}
                </Text>
              </View>
            )}
            
            {provider.props.email && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="email" size={12} color="#6B7280" />
                <Text style={styles.smallContactText}>
                  {provider.props.email}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.contactRight}>
            {(city || province) && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="map-marker" size={12} color="#6B7280" />
                <Text style={styles.smallContactText} numberOfLines={1}>
                  {city}{city && province ? ', ' : ''}{province}
                </Text>
              </View>
            )}
            
            {street && (
              <View style={styles.contactItem}>
                <MaterialCommunityIcons name="home" size={12} color="#6B7280" />
                <Text style={styles.smallContactText} numberOfLines={1}>
                  {street}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  mainInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  industryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  industryText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '500',
    marginLeft: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contactLeft: {
    flex: 1,
    marginRight: 8,
  },
  contactRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    flex: 1,
  },
  chevronContainer: {
    alignSelf: 'center',
    marginLeft: 8,
  },
  horizontalCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: 280,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 128,
    backgroundColor: '#F3F4F6',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2563EB',
    marginLeft: 4,
  },
  horizontalContent: {
    padding: 16,
  },
  horizontalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  industryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  industryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1D4ED8',
    marginLeft: 4,
  },
  horizontalContactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  smallContactText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
});

export default ProviderCard;