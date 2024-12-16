import React, { useContext, useMemo } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { BucketsContext } from "../context/BucketsContext";
import { useTaskContext } from "../context/TaskContext";
import { BucketItem } from "../../components/BucketItem";
import { useVisualsContext } from "../context/VisualsContext";

const { width } = Dimensions.get("window");

export default function BucketsPage() {
  const { visuals } = useVisualsContext();
  const router = useRouter();
  const { buckets } = useContext(BucketsContext);
  const { tasks } = useTaskContext(); // Get tasks from TaskContext

  const backgroundImages = {
    wood_texture: require("../../assets/images/wood_texture.png"),
    wood_texture2: require("../../assets/images/wood_texture2.png"),
    wood_texture3: require("../../assets/images/wood_texture3.png"),
  };

  // Add one placeholder bucket to the list
  const displayedBuckets = [...buckets, null];

  const handleAddBucket = () => {
    router.push("/add-bucket");
  };

  const handleOpenBucket = (bucketId) => {
    router.push(`/buckets/${bucketId}`);
  };

  const renderBucket = ({ item }) => {
    if (item) {
      return (
        <BucketItem
          bucket={item}
          tasks={tasks} // Pass tasks to dynamically calculate tasksCount
          onPress={() => handleOpenBucket(item.id)}
          isPlaceholder={false}
        />
      );
    } else {
      return (
        <BucketItem
          bucket={{ name: "Add Bucket", tasksCount: 0 }}
          onPress={handleAddBucket}
          isPlaceholder={true}
        />
      );
    }
  };

  return (
    <View
      style={[
        styles.background,
        visuals.backgroundType === "color"
          ? { backgroundColor: visuals.background }
          : null,
      ]}
    >
      {visuals.backgroundType === "image" && (
        <ImageBackground
          source={
            backgroundImages[visuals.background] ||
            backgroundImages.wood_texture
          }
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
      )}
      <View style={styles.container}>
        <FlatList
          data={displayedBuckets}
          keyExtractor={(item, index) =>
            item ? item.id : `placeholder-${index}`
          }
          renderItem={renderBucket}
          numColumns={2}
          contentContainerStyle={[styles.gridContainer, { paddingBottom: 100 }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,

    alignItems: "center",
    minHeight: 700,
  },
  gridContainer: {
    paddingBottom: 0,
    width: width * 0.95,
    justifyContent: "center",
  },
  emptySpace: {
    flex: 1,
    margin: 10,
    height: 300,
  },
});
