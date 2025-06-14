// BottomComponent.tsx actualizado
import { COLORS } from '@/src/constants/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface BottomComponentProps {
  title: string;
  onPress?: () => void;
}

const BottomComponent: React.FC<BottomComponentProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity style={styles.bottomContainer} onPress={onPress}>
      <Text style={styles.bottomText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomContainer: {
    backgroundColor: COLORS.buttonBackground,
    width: '100%',
    paddingVertical: verticalScale(10),
    paddingHorizontal: verticalScale(10),
    borderRadius: moderateScale(4),
    alignItems: 'center',
  },
  bottomText: {
    color: COLORS.buttonText,
    fontSize: moderateScale(13),
  },
});

export default BottomComponent;