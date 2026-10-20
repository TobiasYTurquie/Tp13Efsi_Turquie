import React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Flag() {
  const { currentCountry } = useGame();
  const [imgLoading, setImgLoading] = React.useState(true);
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgLoading(true);
    setImgError(false);
  }, [currentCountry]);

  if (!currentCountry) return null;

  return (
    <View style={styles.container}>
      {imgLoading && !imgError && (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      )}
      {imgError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>No se pudo cargar la bandera</Text>
        </View>
      ) : (
        <Image
          source={{ uri: currentCountry.flag }}
          style={[styles.flag, imgLoading && { opacity: 0 }]}
          resizeMode="contain"
          onLoad={() => setImgLoading(false)}
          onError={() => {
            setImgLoading(false);
            setImgError(true);
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e2a3a',
    borderRadius: 16,
    marginVertical: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  flag: {
    width: '95%',
    height: 185,
    borderRadius: 6,
  },
  loader: {
    position: 'absolute',
  },
  errorBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
});
