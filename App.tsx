import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./src/config/firebase";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { CustomContextProvider } from "./src/hooks/useCustomContext";
import { doc, getDoc } from "firebase/firestore";
import CreateProfileStack from "./src/navigation/CreateProfileStack";
import { Loading } from "./src/screens/Auth";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        getDoc(ref)
          .then((doc) => {
            if (doc.exists()) {
              setUser(doc.data());
              console.log("Document data:", doc.data());
              setLoading(false);
            } else {
              console.log("No such document!");
              setLoading(false);
              setUser(null);
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        console.log("No user");
        setUser(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <CustomContextProvider
        value={{
          user,
          setUser,
        }}
      >
        {loading ? (
          <Loading />
        ) : user?.name ? (
          <AppNavigator />
        ) : user?.email ? (
          <CreateProfileStack />
        ) : (
          <AuthNavigator />
        )}
      </CustomContextProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
