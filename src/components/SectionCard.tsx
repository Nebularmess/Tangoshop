import { Href, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

interface SectionCardProps {
  title: string;
  redirect?: Href; 
  children?: React.ReactNode;
}

export default function SectionCard({ title, redirect, children }: SectionCardProps) {
  const router = useRouter();

  const handleRedirect = () => {
    if (redirect) {
      router.navigate(redirect)
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {redirect && (
          <TouchableOpacity onPress={handleRedirect}>
            <Text style={styles.linkText}>Ver más</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: moderateScale(8),
    borderRadius: moderateScale(8),
    marginTop: verticalScale(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: '#000',
  },
  linkText: {
    color: '#3B82F6',
    fontSize: moderateScale(14),
  },
  content: {
    marginTop: verticalScale(8),
  },
});

