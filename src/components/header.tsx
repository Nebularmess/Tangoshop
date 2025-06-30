import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;

}

const Header: React.FC<HeaderProps> = ({ title, subtitle, children, }) => {
  return (
    <ImageBackground
      source={require('../../src/assets/images/bgHeader.jpeg')}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={20}
    >
      <View style={styles.container}>
        <View>
          {title && <Text style={styles.title}>{title}</Text>}
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {children && <View style={styles.childrenContainer}>{children}</View>}
      </View>
    </ImageBackground>
  );
};

// PropTypes no son necesarios cuando se usa TypeScript con interfaces

const styles = StyleSheet.create({
  backgroundImage: {
    paddingTop: verticalScale(24),
    borderBottomRightRadius: moderateScale(20),
    borderBottomLeftRadius: moderateScale(20),
    overflow: 'hidden',
  },
  container: {
    padding: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(16),
    color: 'white',
    opacity: 0.9,
  },
  childrenContainer: {
    marginTop: verticalScale(16),
  },
});

export default Header;