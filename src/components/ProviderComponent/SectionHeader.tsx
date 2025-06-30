import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  showArrow?: boolean;
  icon?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  showArrow = false,
  icon
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {icon && (
            <MaterialCommunityIcons 
              name={icon as any} 
              size={20} 
              color="#374151" 
              style={styles.icon}
            />
          )}
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {(actionText || showArrow) && (
          <TouchableOpacity
            onPress={onActionPress}
            style={styles.actionButton}
            activeOpacity={0.7}
          >
            {actionText && (
              <Text style={styles.actionText}>
                {actionText}
              </Text>
            )}
            {showArrow && (
              <MaterialCommunityIcons name="chevron-right" size={20} color="#2563EB" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    color: '#2563EB',
    fontWeight: '500',
    marginRight: 4,
  },
});

export default SectionHeader;