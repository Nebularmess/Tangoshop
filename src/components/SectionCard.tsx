import { Href, useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

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
    <View className='bg-white p-2 rounded-lg'>
      <View className='flex-row justify-between items-center'>
        <Text className='text-xl font-bold'>{title}</Text>
        {redirect && (
          <TouchableOpacity onPress={handleRedirect}>
            <Text className='text-blue-500'>Ver más</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {children && (
        <View className='mt-2'>
          {children}
        </View>
      )}
    </View>
  );
}

