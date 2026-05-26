import {
    useDeleteProduct,
    useInsertProduct,
    useProduct,
    useUpdateProduct,
} from '@/api/products';
import { useRestaurantList } from '@/api/restaurants';
import { defaultPizzaImage } from '@/components/ProductListItem';
import Colors from '@/constants/Colors';
import Button from '@components/Button';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';


const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === 'string' ? idString : idString?.[0]
  );
  const isUpdating = !!idString;

  const { data: restaurants } = useRestaurantList();
  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { data: updatingProduct } = useProduct(id);
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price is not a number');
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (isUpdating) {
      // update
      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // Save in the database
    insertProduct(
      {
        name,
        price: parseFloat(price),
        image: imagePath,
        restaurant_id: restaurants?.[0]?.id ?? 1,
      },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
        },
      }
    );
  };

  const pickImage = async () => {
    Alert.alert('Image picker is not available in this build.');
  };

  const onDelete = () => {
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
       // router.replace('/(admin)');
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image) {
      return defaultPizzaImage;
    }

    if (image.startsWith('file://')) {
      Alert.alert('Image upload is not available in this build.');
      return defaultPizzaImage;
    }

    return image;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        placeholder="9.99"
        style={styles.input}
        keyboardType="numeric"
      />

      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button onPress={onSubmit} text={isUpdating ? 'Update' : 'Create'} />
      {isUpdating && (
        <Text onPress={confirmDelete} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
};

export default CreateProductScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },

  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
});