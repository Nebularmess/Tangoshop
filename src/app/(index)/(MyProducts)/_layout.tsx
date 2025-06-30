import { Stack } from "expo-router";

const MyProductsLayout = () => {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
};

export default MyProductsLayout;
