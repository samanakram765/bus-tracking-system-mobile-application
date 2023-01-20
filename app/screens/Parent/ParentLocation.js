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
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase/firebaseConfig";

const ParentLocation = () => {
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

  const getDriverLocation = () => {
    const driverCollection = collection(database, "location");
    const q = query(
      driverCollection,
      where("institute", "==", user.institute),
      where("busNo", "==", user.busNo)
    );
    onSnapshot(q, (driverSnapshot) => {
      const driverLocation = driverSnapshot.docs.map((driverLocation) => ({
        id: driverLocation,
        ...driverLocation.data(),
      }));
      setCurrentLocation(
        new AnimatedRegion({
          latitude: driverLocation[0].latitude,
          longitude: driverLocation[0].longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        })
      );

      console.log("Driver Location : ", driverLocation);
    });
  };

  useEffect(() => {
    request(user);
  }, []);

  useEffect(() => {
    getDriverLocation();
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

export default ParentLocation;
