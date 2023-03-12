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

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const data = getDoc(ref)
          .then((doc) => {
            if (doc.exists()) {
              setUser(doc.data());
            } else {
              console.log("No such document!");
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
          });
      } else {
        setUser(null);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <CustomContextProvider
        value={{
          user,
          setUser,
        }}
      >
        {user ? <AppNavigator /> : <AuthNavigator />}
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
