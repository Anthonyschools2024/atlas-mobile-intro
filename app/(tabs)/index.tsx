import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';
import { FlashList } from '@shopify/flash-list';

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

  // Refreshes the list when the screen is focused
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

  const ListHeader = () => (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">My Activities</ThemedText>
      </ThemedView>
      <Link href="/add-activity" asChild>
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Add activity</ThemedText>
        </TouchableOpacity>
      </Link>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <FlashList
        data={activities}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContainer}
        estimatedItemSize={80} // Average height of an item
        ListEmptyComponent={<ThemedText style={styles.emptyText}>No activities yet.</ThemedText>}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
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
  },
  separator: {
    height: 12,
  },
});