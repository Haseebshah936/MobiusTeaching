import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Image, StyleSheet, Text, View } from "react-native";
import { Auth, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./src/config/firebase";
import AuthNavigator from "./src/navigation/AuthNavigator";
import AppNavigator from "./src/navigation/AppNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { CustomContextProvider } from "./src/hooks/useCustomContext";
import { doc, getDoc, setDoc } from "firebase/firestore";
import CreateProfileStack from "./src/navigation/CreateProfileStack";
import { Loading } from "./src/screens/Auth";
import * as SecureStore from "expo-secure-store";
import { signIn } from "./src/config/firebase/functions";
import { gestureHandlerRootHOC } from "react-native-gesture-handler";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    getUserAuth().then(() => {
      unsubscribe = authListener();
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log("🚀 ~ file: App.tsx:29 ~ getUserAuth ~ user", user);
  }, [user]);

  const getUserAuth = async () => {
    try {
      const auth = await SecureStore.getItemAsync("auth");
      if (auth) {
        const { email, password } = JSON.parse(auth);
        await signIn(email, password);
      } else {
        setUser(null);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error getting document:", error);
      setLoading(false);
      setUser(null);
    }
  };

  const authListener = async () => {
    await getUserAuth();
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        getDoc(ref)
          .then(async (doc) => {
            if (doc.exists() && doc.data().email) {
              setUser({ ...doc.data(), id: user.uid });
              setLoading(false);
            } else {
              setLoading(false);
              await setDoc(ref, {
                email: user.email,
              });
              setUser({
                email: user.email,
              });
            }
          })
          .catch((error) => {
            console.log("Error getting document:", error);
            setUser(null);
            setLoading(false);
          });
      } else {
        console.log("No user");
        setUser(null);
        setLoading(false);
      }
    });
  };

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
};

export default gestureHandlerRootHOC(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
