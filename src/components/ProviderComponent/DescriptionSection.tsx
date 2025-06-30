import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DescriptionSectionProps {
  title: string;
  description: string;
  maxLines?: number;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({
  title,
  description,
  maxLines = 3
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const handleTextLayout = (event: any) => {
    const { lines } = event.nativeEvent;
    if (lines.length > maxLines) {
      setShowReadMore(true);
    }
  };

  if (!description || description.trim().length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {title}
      </Text>
      
      <Text
        style={styles.description}
        numberOfLines={isExpanded ? undefined : maxLines}
        onTextLayout={!isExpanded ? handleTextLayout : undefined}
      >
        {description}
      </Text>
      
      {showReadMore && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.readMoreButton}
          activeOpacity={0.7}
        >
          <Text style={styles.readMoreText}>
            {isExpanded ? 'Ver menos' : 'Ver más'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 24,
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    color: '#2563EB',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default DescriptionSection;