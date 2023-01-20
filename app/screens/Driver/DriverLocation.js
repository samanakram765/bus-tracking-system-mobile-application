import { Image, Platform, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import MapView, {
  Animated,
  AnimatedRegion,
  Marker,
  MarkerAnimated,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import * as Location from "expo-location";
// import Geolocation from "@react-native-community/geolocation";

import { useApi } from "../../hooks/useApi";
import { GOOGLE_MAPS_APIKEY } from "../../maps/maps";
import { getBusRoutes } from "../../firebase/firebaseCalls/bus";
import AuthContext from "../../context/AuthContext";
import { colors } from "../../config";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

const DriverLocation = () => {
  const { user } = useContext(AuthContext);
  const mapViewRef = useRef();
  const [coordinates, setCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(
    new AnimatedRegion({
      latitude: 31.556,
      longitude: 74.3186,
      latitudeDelta: 1,
      longitudeDelta: 1,
    })
  );
  const [ready, setReady] = useState();
  const { data, request } = useApi(getBusRoutes);
  const markerRef = useRef();

  const coordinatesCopy = [...coordinates];
  const origin = coordinatesCopy.shift();
  const destination = coordinatesCopy.pop();

  const setBusRoutes = () => {
    if (data.length > 0) {
      const busRoutes = data[0].busRoutes;
      const convertedBusRoutes = busRoutes.map((route) => ({
        coordinates: {
          latitude: Number(route.latitude),
          longitude: Number(route.longitude),
        },
      }));
      setCoordinates(convertedBusRoutes);

      // setDriverCurrentLocation(convertedBusRoutes);
    }
  };

  const setDriverCurrentLocation = () => {
    if (currentLocation) {
      coordinates?.shift();
      coordinates.unshift({ coordinates: currentLocation });
      console.log("Converted Bus : ", coordinates);
      setCoordinates(coordinates);
    }
  };

  const geoLocation = async () => {
    const result = await Location.requestForegroundPermissionsAsync();

    if (result === "granted") {
      await Location.requestBackgroundPermissionsAsync();
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.LocationAccuracy.Highest,
    });
    animate(location.coords.latitude, location.coords.longitude);
    setCurrentLocation(
      new AnimatedRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      })
    );

    const data = {
      busNo: user.busNo,
      institute: user.institute,
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    const locationCollection = collection(database, "location");

    const q = query(
      locationCollection,
      where("institute", "==", user.institute),
      where("busNo", "==", user.busNo)
    );
    const locationSnapshot = await getDocs(q);

    if (locationSnapshot.empty) return await addDoc(locationCollection, data);

    const locationData = locationSnapshot.docs.map((location) => ({
      id: location.id,
      ...location.data(),
    }));
    const locationRef = doc(database, "location", locationData[0].id);

    await updateDoc(locationRef, {
      ...data,
    });

    console.log("Location : ", location);
  };

  const animate = (latitude, longitude) => {
    const newCoordinate = { latitude, longitude };
    if (Platform.OS === "android") {
      if (markerRef.current) {
        markerRef.current.animateMarkerToCoordinate(newCoordinate, 7000);
      } else {
        currentLocation.timing(newCoordinate).start();
      }
    }
  };

  useEffect(() => {
    request(user);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      geoLocation();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setBusRoutes();
  }, [data]);

  return (
    <>
      <MapView
        ref={mapViewRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        loadingBackgroundColor="#eeeeee"
        loadingIndicatorColor="#666666"
        loadingEnabled={true}
      >
        {currentLocation && (
          <Marker.Animated
            coordinate={currentLocation}
            ref={markerRef}
            title="It's You"
            pinColor={colors.purple}
            flat={true}
          ></Marker.Animated>
        )}

        {coordinates.length > 0 &&
          coordinates?.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker.coordinates}
              title={marker.title}
            ></Marker>
          ))}

        {coordinates.length > 0 && (
          <MapViewDirections
            strokeWidth={3}
            strokeColor="red"
            mode="DRIVING"
            onReady={(result) => {
              setReady(result);
              mapViewRef.current.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                },
              });
            }}
            optimizeWaypoints={true}
            waypoints={coordinatesCopy?.map((waypoint) => waypoint.coordinates)}
            origin={origin?.coordinates}
            destination={destination?.coordinates}
            apikey={GOOGLE_MAPS_APIKEY}
          />
        )}
      </MapView>
    </>
  );
};

export default DriverLocation;
