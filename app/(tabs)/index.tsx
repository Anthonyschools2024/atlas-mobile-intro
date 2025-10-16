import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, FlatList, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useDatabase, Activity } from '@/hooks/useDatabase';

export default function HomeScreen() {
  const { getActivities } = useDatabase();
  const [activities, setActivities] = useState<Activity[]>([]);

  const loadActivities = useCallback(() => {
    async function loadData() {
      const data = await getActivities();
      setActivities(data);
    }
    loadData();
  }, [getActivities]);

  useFocusEffect(
    useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  const renderItem = ({ item }: { item: Activity }) => (
    <ThemedView style={styles.activityItem}>
      <ThemedText>
        Steps: <ThemedText type="defaultSemiBold">{item.steps}</ThemedText>
      </ThemedText>
      <ThemedText style={styles.dateText}>
        {new Date(item.date).toLocaleString()}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Activities</ThemedText>
      </ThemedView>

      <Link href="/add-activity" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Add activity</ThemedText>
        </TouchableOpacity>
      </Link>

      <FlatList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No activities yet.</ThemedText>}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    gap: 12,
  },
  activityItem: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  }
});